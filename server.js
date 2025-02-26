const express = require("express");
const http = require('http');
const path = require('path');
const app = express();

//middleware per leggere JSON nel body della richiesta
app.use(express.json());


//middleware per leggere dati URL-encoded (necessario se il form invia dati come "application/x-www-form-urlencoded")
app.use(express.urlencoded({ extended: true }));

const database = require("./database");
database.createTable();

app.use("/", express.static(path.join(__dirname, "public")));

app.use('/node_modules', express.static(__dirname + '/node_modules'));



app.post("/insert", async (req, res) => {
  const dato = req.body.booking 
  console.log("DATOOO:   " ,dato)


  if (!dato || !dato.idtype || !dato.date || !dato.hour || !dato.name) {
    console.error("❌ Dati incompleti:", dato);
    return res.status(400).json({ result: "ko", message: "Dati incompleti" });
  }


  try {
    await database.insert(dato);
    res.json({result: "ok"});
  } catch (e) {

    console.error("❌ Errore durante l'inserimento:", e);
    res.status(500).json({result: "ko"});
  
  }
})



app.get('/booking', async (req, res) => {
    const list = await database.select();
    res.json(list);
});

app.delete('/delete/:id', async (req, res) => {
  await database.delete(req.params.id);
  res.json({result: "ok"});
})

const server = http.createServer(app);
server.listen(5600, () => {
  console.log("- server running on port: " + 5600);
});