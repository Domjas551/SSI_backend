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


function insert(){
  pool.query("Insert into task_type values(6,'test')", (err, result)=> {
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
  console.log(req.body);
  res.send({message:"mam"});
})


module.exports = router;
