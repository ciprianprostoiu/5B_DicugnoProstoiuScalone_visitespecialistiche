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
  
  if (!dato) {
    console.log("❌ Dato non ricevuto correttamente");
  } else {
    console.log("✅ Dato ricevuto correttamente");
  }

  const key = Object.keys(dato).find(key => key.includes('-')); // 1-20250227-8

  if (key) {
      const [idType, dateHour] = key.split('-'); // idType  1  -----  dateHour 20250227-8

      // Estrai la data e l'ora
      const date = dateHour.substring(0, 8); // 20250227
      const hour = dateHour.substring(9); // 8

      // riformatto i dati
      dato = {
          idType: parseInt(idType),
          date: formatDate(date), // Formatta la data
          hour: parseInt(hour),
          name: dato[key] //valore associato alla chiave 1-20250227-8
      };
      console.log("DATO RIFORMATTATO:   ", dato);
  }

  // dati  completi
  if (!dato || !dato.idType || !dato.date || !dato.hour || !dato.name) {
    console.error("❌❌❌ Dati incompleti ❌❌❌:", dato);
    return res.status(400).json({ result: "ko", message: "Dati incompleti" });
  }

  try {
    await database.insert(dato);  // Inserisci i dati nel database
    res.json({ result: "ok" });
  } catch (e) {
    console.error("❌❌❌ Errore durante l'inserimento ❌❌❌:", e);
    res.status(500).json({ result: "ko" });
  }
});

// Funzione per formattare la data nel formato "yyyy-mm-dd"
function formatDate(dateStr) {
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}




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