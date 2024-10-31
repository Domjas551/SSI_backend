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

router.post("/post",(req,res)=>{
  console.log(req.body["value"]);

  if(req.body["value"] == 1){
    res.send({message:"1001"});
  }else{
    res.send({message:"Error: Podano niepoprawną wartość"});
  }

})

//metoda do zwracania danych użytkowników
router.get("/users",(req,res)=>{

  selectUserData().then((data)=>{
    res.send(data);
  })

})


module.exports = router;
