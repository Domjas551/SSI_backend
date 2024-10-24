var mysql=require('mysql2');
var express = require('express');
var router = express.Router();

const pool=mysql.createPool({
  host:'127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'ssi_db'
})

function select(){
  pool.query("Select * from task_type", (err, result)=> {
    if (err) throw err;
    console.log(result);
  });
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

module.exports = router;
