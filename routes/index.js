var mysql=require('mysql2');
var express = require('express');
const {log} = require("debug");
var router = express.Router();
const app = express();

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
        console.log(err.code);
        let message;

        if(err.code=="ECONNREFUSED"){
          message="Can't connect to data base";
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
        console.log(err);
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
        console.log(err);
      }else{
        resolve(result);
      }
    });
  })
}
function insert(){
  pool.query("Insert into task_type values(null,'test')", (err, result)=> {
    if (err) throw err;
    console.log(result);
  });
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

  console.log(req.body.query)

  if(req.body.query==null){
    selectUsersData().then((data)=>{
      res.send(data);
    })
  }else{
    selectUsersData(req.body.query).then((data)=>{
      res.send(data);
    })
  }

})

//metoda do zwracania danych konkretnego użytkownika
router.post("/user",(req,res)=>{
  selectUserData(req.body.value).then((data)=>{
    res.send(data);
  })

})

//metoda do edycji danych użytkownika
router.put("/user",(req,res)=>{
  updateUserData(req.body.id,req.body.name,req.body.surname,req.body.position,req.body.is_active)
  selectUserData(req.body.id).then((data)=>{
    res.send(data)
  })
})


module.exports = router;
