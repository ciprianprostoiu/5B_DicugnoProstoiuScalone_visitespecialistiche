const express = require("express");
const http = require('http');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const database = require("./database");
database.createTable();
app.use("/", express.static(path.join(__dirname, "public")));
app.use('/node_modules', express.static(__dirname + '/node_modules'));



app.post("/insert", async (req, res) => {  
  let dato = req.body;//.booking
  console.log("DATOOO DAL CLIENTT: ", dato);

  try {
    await database.insert(dato);  // Inserisci i dati nel database
    res.json({ result: "ok" });
  } catch (e) {
    console.error("❌❌❌ Errore durante l'inserimento ❌❌❌:", e);
    res.status(500).json({ result: "ko" });
  }
});



app.get('/booking', async (req, res) => {
    const list = await database.select();
    console.log(list)
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