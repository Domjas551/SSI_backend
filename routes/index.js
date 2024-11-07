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

class tast_type{

  name;

  constructor(name) {
    this.name=name;
  }

}

function select(){
  pool.query("Select * from task_type", (err, result)=> {
    if (err) throw err;
    t1=new tast_type(result[0].name);
    console.log(t1);
    console.log(result);
  });
}

function select2(){
  return new Promise((resolve, reject)=>{
    pool.query("Select * from task_type", (err, result)=> {
      if(err){
        console.log(err);
      }else{
        resolve(result);
      }
    });
  })
}

function selectUserData(){
  return new Promise((resolve, reject)=>{
    pool.query("Select user_id, name, surname, email, position, is_active from user", (err, result)=> {
      if(err){
        console.log(err);
      }else{
        resolve(result);
      }
    });
  })
}

//funkcja do pobierania danych wszystkich użytkowników
function selectUsersData(){
  return new Promise((resolve, reject)=>{
    pool.query("Select user_id, name, surname, email, position, is_active from user", (err, result)=> {
      if(err){
        console.log(err);
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

router.get('/i', async(req, res, next)=> {
  insert();
  res.render('index', { title: 'Express backend!' });
});

router.get('/s', async(req, res, next)=> {
  select();
  res.render('index', { title: 'Express backend!' });
});

router.get("/type",(req,res)=>{

  select2().then((data)=>{
    console.log(data);
    res.send(data);
  })

})

//metoda do zwracania danych użytkowników
router.get("/users",(req,res)=>{

  selectUsersData().then((data)=>{
    res.send(data);
  })

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
