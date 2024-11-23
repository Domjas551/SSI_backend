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
    resetUserPassword(req.body.id, req.body.password).catch((error)=>{
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
  }

})

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

//metoda do logowania
router.put("/login",(req,res)=>{


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
