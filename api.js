
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const mysql_config = require('./inc/mysql_config');
const functions = require('./inc/functions');

const API_AVAILABILITY = true;
const AP_VERSION = '1.0.0';


const app = express();
app.listen(3000, ()=>{
    console.log("Server Open!");
})




app.use((req, res, next)=>{
    if(API_AVAILABILITY)
    {
        next();
    }
    else
    {
        res.json(functions.response('atenção', 'API está em manutenção, Sinto muito', 0,null))
    }
})


const connection = mysql.createConnection(mysql_config);

app.use(cors());

app.get('/', (req, res) =>{
    res.json(functions.response('sucesso', 'API está rodando',0, null))
})

app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks',(err, rows));
})

app.get('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id=?',[id],(err,rows)=>{
        if(!err)
        {
            if(rows.lenght>0)
            {
                res.json(functions.response('Sucesso', 'Sucesso na pesquisa', rows.affectedRows(data)))

            }
            else
            {
                res.json(functions.response('Atenção', 'Não foi possível encontrar a task solicitada',0,null))
            }
        }
        else
        {
            res.json(functions.response('error', err.message,0,null))
        }
    })
})



app.put('/tasks/:id/status/:status',(req,res)=>{
    const id = req.params.id;
    const status = req.params.status;
    connection.query('UPDATE tasks SET status=? WHERE id=?',[status,id],(err,rows) =>{
        if(!err)
        { 
            if(rows.affectedRows > 0)
            {
                res.json(functions.response('Sucesso', 'Sucesso na alteração de status'.rows.affectedRows, null));
            }
            else
            {
                res.json(functions.response('Atenção', 'Task não encontrada',0, null));
            }
        }
        else
        {
            res.json(functions.response('Erro', err.message,0,null));
        }
    })
})

app.use((req,res)=>{
    res.json(functions.response('atenção', 'Rota não encontrada', 0, null))
})