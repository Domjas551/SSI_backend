var mysql=require('mysql2');
var express = require('express');
const {log} = require("debug");
var router = express.Router();
const app = express();
const bcrypt=require('bcrypt')

const pool=mysql.createPool({
  host:'127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'ssi_db'
})

//funkcja do pobierania danych wszystkich użytkowników
function selectUsersData(query="Select user_id, name, surname, email, position, is_active from user"){
  return new Promise((resolve, reject)=>{
    pool.query(query, (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych wszystkich pracowników przypisanych do zadania
function selectAppointedUserData(id){
  return new Promise((resolve, reject)=>{
    pool.query(`Select user.user_id, user.name, user.surname, user.email, user.position from user left join user_task on user.user_id=user_task.user_id where user.is_active=1 and user_task.task_id=${id}`, (err, result)=> {
      if(err){
        let message;
        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }
        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych wszystkich pracowników nie przypisanych do zadania
function selectNotAppointedUserData(id){
  return new Promise((resolve, reject)=>{
    pool.query(`SELECT user.user_id, user.name, user.surname, user.email, user.position FROM user LEFT JOIN user_task ON user.user_id = user_task.user_id AND user_task.task_id =${id} WHERE user_task.task_id IS NULL and user.is_active=1`, (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych wszystkich zadań
function selectTasksData(query="Select task.task_id, task.task_type_id, task_type.name, task.status, task.date, task.deadline from task join task_type on task.task_type_id=task_type.task_type_id"){
  return new Promise((resolve, reject)=>{
    pool.query(query, (err, result)=> {
      if(err){
        let message;
        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }
        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania emaili wszystkich użytkowników
function getEmails(){
  return new Promise((resolve, reject)=>{
    pool.query("Select email from user", (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych konkretnego użytkownika
function selectUserData(id){
  return new Promise((resolve, reject)=>{
    pool.query(`Select user_id, name, surname, email, position, is_active from user where user_id=${id}`, (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych konkretnego zadania
function selectTaskData(id){
  return new Promise((resolve, reject)=>{
    pool.query(`Select task.task_id, task.task_type_id, task_type.name, task.status, task.date, task.deadline, task.description from task join task_type on task.task_type_id=task_type.task_type_id where task.task_id=${id}`, (err, result)=> {
      if(err){
        let message;
        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message=`Błąd przy próbie pobrania danych TaskID: ${id}`;
        }
        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do aktualizacji danych użytkownika
function updateUserData(id,name,surname,position,is_active){
  return new Promise((resolve, reject)=>{
    pool.query(`Update user set name="${name}", surname="${surname}", position="${position}", is_active=${is_active} where user_id=${id}`, (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie aktualizacji danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do aktualizacji danych zadań
function updateTaskData(id, typeId, state, description, date, deadline){
  return new Promise((resolve, reject)=>{
    pool.query(`Update task set task_type_id=${typeId}, status="${state}", description="${description}", date="${date}", deadline="${deadline}" where task_id=${id}`, (err, result)=> {
      if(err){
        let message;
        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie aktualizacji danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do resetu hasła użytkownika
function resetUserPassword(id,password){
  return new Promise((resolve, reject)=>{
    pool.query(`Update user set password="${password}" where user_id=${id}`, (err, result)=> {
      if(err){
        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie aktualizacji danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych wszystkich typów danych
function selectTaskTypesData(query="Select task_type_id, name from task_type"){
  return new Promise((resolve, reject)=>{
    pool.query(query, (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do dodawania nowych użytkowników
function insertUser(name,surname,password,email,phone,position){
  return new Promise((resolve, reject)=>{
    pool.query(`Insert into user values(null, "${name}", "${surname}", "${password}", "${email}", ${phone}, "${position}",1)`, (err, result)=> {
      if(err){
        console.log(err)
        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie dodania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do przypisywania użytkowników do zadań
function assignUser(taskId, userId){
  return new Promise((resolve, reject)=>{
    pool.query(`Insert into user_task values(${userId}, ${taskId})`, (err, result)=> {
      if(err){
        console.log(err)
        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie dodania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do cofania przypisań użytkowników do zadań
function unassignUser(taskId, userId){
  return new Promise((resolve, reject)=>{
    pool.query(`DELETE FROM user_task WHERE user_id = ${userId} AND task_id = ${taskId}`, (err, result)=> {
      if(err){
        console.log(err)
        let message;
        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie dodania danych";
        }
        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do logowania
function login(email, password){
  return new Promise((resolve, reject)=>{
    pool.query(`Select password, position from user where email="${email}" and is_active=1`, (err, result)=> {
      if(err){

        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie pobrania danych";
        }

        reject(message)
      }else{

        bcrypt.compare(password,result[0].password, function(err,res){

          let uprawnienia;

          if(res){
            if(result[0].position=="pracownik"){
              uprawnienia=3;
            }else if(result[0].position=="kierownik"){
              uprawnienia=2;
            }else{
              uprawnienia=1
            }
          }else{
            uprawnienia=-1;
          }
          resolve(uprawnienia);
        })
      }
    });
  })
}

//funkcja do dodawania nowych zadań
function insertTask(typeId,description,status,date,deadline){
  return new Promise((resolve, reject)=>{
    pool.query(`Insert into task values(null, ${typeId}, "${description}", "${status}", "${date}", "${deadline}")`, (err, result)=> {
      if(err){
        console.log(err)
        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie dodania danych";
        }
        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do dodawania nowych typów zadań
function insertTaskType(query){
  return new Promise((resolve, reject)=>{
    pool.query(query, (err, result)=> {
      if(err){
        console.log(err)
        let message;

        if(err.code=="ECONNREFUSED"){
          message="Nie można połączyć sie z bazą danych";
        }else if(err.code=="ER_PARSE_ERROR"){
          message="Błąd przy próbie dodania danych";
        }

        reject(message)
      }else{
        resolve(result);
      }
    });
  })
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express backend!' });
});

//metoda do zwracania danych użytkowników
router.get("/users",(req,res)=>{

  selectUsersData().then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })

})

//metoda do zwracania danych zadań
router.get("/tasks",(req,res)=>{

  selectTasksData().then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })
})


//Metoda do filtrowania użytkowników
router.post("/users",(req,res)=>{

  if(req.body.query==null){
    selectUsersData().then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }else{
    selectUsersData(req.body.query).then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }

})

//metoda do zwracania danych konkretnego użytkownika
router.post("/user",(req,res)=>{
  selectUserData(req.body.value).then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })

})

//metoda do zwracania danych konkretnego zadania
router.post("/task",(req,res)=>{
  selectTaskData(req.body.value).then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })

})

//metoda do zwracania danych uzytkowników przypisanych do konkretnego zadania
router.post("/usersAppointedToTask",(req,res)=>{
  selectAppointedUserData(req.body.value).then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })

})

//metoda do zwracania danych uzytkowników nie przypisanych do konkretnego zadania
router.post("/usersNotAppointedToTask",(req,res)=>{
  selectNotAppointedUserData(req.body.value).then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })

})

//metoda do edycji danych użytkownika
router.put("/user",(req,res)=>{

  let alfa=0;

  if(req.body.password==undefined){


    updateUserData(req.body.id,req.body.name,req.body.surname,req.body.position,req.body.is_active).catch((error)=>{
      alfa=1;
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })

    selectUserData(req.body.id).then((data)=>{
      if(alfa==0){
        res.send(data)
      }
    }).catch((error)=>{
      if(alfa==0){
        //wysyłanie wiadomości o błędzie na frontend
        res.send([{ error: error}]);
      }
    })
  }else{

    bcrypt.hash(req.body.password,10,function(err, hash){
      resetUserPassword(req.body.id, hash).catch((error)=>{
        alfa=1;
        //wysyłanie wiadomości o błędzie na frontend
        res.send([{ error: error}]);
      })
    })

    selectUserData(req.body.id).then((data)=>{
      if(alfa==0){
        res.send(data)
      }
    }).catch((error)=>{
      if(alfa==0){
        //wysyłanie wiadomości o błędzie na frontend
        res.send([{ error: error}]);
      }
    })
  }

})

//metoda do edycji danych zadań
router.put("/task", (req, res) => {
  const { id, type_id, state, description, date, deadline } = req.body;

  if (!id || !type_id || !state || !date || !deadline) {
    res.status(400).send([{ error: "Wszystkie pola są wymagane" }]);
    return;
  }

  updateTaskData(id, type_id, state, description, date, deadline)
      .then((result) => {
        res.status(200).send([{ success: "Dane zadania zostały zaktualizowane" }]);
      })
      .catch((error) => {
        res.status(500).send([{ error: error }]);
      });
});

//metoda do pobierania emaili użytkowników
router.get("/admin/userAdd",(req,res)=>{

  getEmails().then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })
})

//metoda do dodawania nowych użytkowników
router.put("/admin/userAdd",(req,res)=>{

  let alfa = 0;

  bcrypt.hash(req.body.password,10,function(err, hash){
    insertUser(req.body.name,req.body.surname,hash,req.body.email,req.body.phone,req.body.position).catch((error) => {
      alfa = 1;
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{error: error}]);
    })
  })

  getEmails().then((data)=>{
    if(alfa==0){
      res.send(data);
    }

  }).catch((error)=>{
    if(alfa==0){
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    }
  })

})

router.put("/manager/taskAdd", (req, res) => {
  insertTask(req.body.typeId, req.body.description, req.body.status, req.body.date, req.body.deadline)
      .then(() => {
        res.status(200).json([{ message: "Task added successfully" }]);
      })
      .catch((error) => {
        res.status(500).json([{ error: error }]);
      });
});

router.put("/manager/assign", (req, res) => {
  assignUser(req.body.taskId, req.body.userId)
      .then(() => {
        res.status(200).json([{ message: "User assigned successfully" }]);
      })
      .catch((error) => {
        res.status(500).json([{ error: error }]);
      });
});

router.put("/manager/unassign", (req, res) => {
  unassignUser(req.body.taskId, req.body.userId)
      .then(() => {
        res.status(200).json([{ message: "User unassigned successfully" }]);
      })
      .catch((error) => {
        res.status(500).json([{ error: error }]);
      });
});



//metoda do logowania
router.put("/login",(req,res)=>{

  //blok do haszowania haseł
  //wymaga zmiany w selectUsersData dodać hasło w zwracanych
  /*
  selectUsersData().then((data)=>{

    for (const user of data) {

      bcrypt.hash(user.password,10,function(err, hash){
      return new Promise((resolve, reject)=>{

          pool.query(`Update user set password="${hash}" where user_id=${user.user_id}`, (err, result)=> {
          if(err){
            let message;

            if(err.code=="ECONNREFUSED"){
              message="Nie można połączyć sie z bazą danych";
            }else if(err.code=="ER_PARSE_ERROR"){
              message="Błąd przy próbie aktualizacji danych";
            }

            reject(message)
          }else{
            resolve(result);
          }
        });

      })

    })
    }
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    console.log("err")
  })*/

  login(req.body.email,req.body.password).then((data)=>{

    res.send([{uprawnienia: data, email:req.body.email }]);

  }).catch((error) => {
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{error: error}]);
  })

})

//metoda do zwracania danych typów zadań
router.get("/taskTypes",(req,res)=>{

  selectTaskTypesData().then((data)=>{
    res.send(data);
  }).catch((error)=>{
    //wysyłanie wiadomości o błędzie na frontend
    res.send([{ error: error}]);
  })

})

//Metoda do filtrowania typów zadań
router.post("/taskTypes",(req,res)=>{

  if(req.body.query==null){
    selectTaskTypesData().then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }else{
    selectTaskTypesData(req.body.query).then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }

})

//Metoda do filtrowania danych zadań
router.post("/tasks",(req,res)=>{

  if(req.body.query==null){
    selectTasksData().then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }else{
    selectTasksData(req.body.query).then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }

})

//Metoda do filtrowania typów zadań oraz do dodawania nowych typów
router.put("/taskTypes",(req,res)=> {

  if (req.body.newType != null){
    let alfa = 0;

    insertTaskType(req.body.newType).catch((error) => {
      alfa = 1;
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{error: error}]);
    })

    selectTaskTypesData().then((data) => {
      if (alfa == 0) {
        res.send(data)
      }
    }).catch((error) => {
      if (alfa == 0) {
        //wysyłanie wiadomości o błędzie na frontend
        res.send([{error: error}]);
      }
    })
  }else if(req.body.query==null){
    selectTaskTypesData().then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }else if(req.body.query!=null){
    selectTaskTypesData(req.body.query).then((data)=>{
      res.send(data);
    }).catch((error)=>{
      //wysyłanie wiadomości o błędzie na frontend
      res.send([{ error: error}]);
    })
  }

})

module.exports = router;
