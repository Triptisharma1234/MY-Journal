const express = require('express');
const app = express();
require('dotenv').config();

const mysql = require('mysql2');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

console.log("Loaded ENV:", process.env.DB_USER, process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PASSWORD
});

app.use(express.json());

connection.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

const port = 3000;

app.get("/api/entries",(req , res)=>{
    const q = "SELECT id, title, content, created_at FROM entries ORDER BY created_at DESC";

    connection.query(q, (err,results)=>{
        if(err)
        {
            res.status(500).send("Some error in database");
        }
        res.json(results);
    });
});

// app.get("/api/journals", (req, res)=>{
//     res.json(journals);
// })

app.post("/api/journals", (req, res)=>{ 
    const {title, content} = req.body;   
     if(!title || !content)
     {
        return res.status(400).send("Title and content are required");
     }

     const q = "INSERT INTO entries (title, content, created_at) VALUES (?, ?, NOW())";
     connection.query(q, [title, content], (err, result)=>{
        if(err){
        console.log("❌ Error inserting entry:", err);
        res.status(500).send("Database insert error");
    
     }
     else{
        res.status(201).send("✅ New journal entry added");
     }
     });
});

app.delete("/api/entries/:id", (req,res)=>{
    const { id } = req.params;
  const q = "DELETE FROM entries WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting entry:", err);
      res.status(500).send("Error deleting entry");
    } else {
      res.status(200).send("✅ Entry deleted successfully");
    }
  });
});


app.listen(port, ()=>{
    console.log(`port has been started on port ${port}`);
});