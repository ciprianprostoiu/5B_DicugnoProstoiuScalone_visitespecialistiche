const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.ssl = {
   ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
         if (err) {
            console.error(err);
            reject();
         }
         console.log('done');
         resolve(result);
      });
   })
}

const database = {
   createTable: async () => {//faccio prima type
      await executeQuery(`
         CREATE TABLE IF NOT EXISTS type (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(20) NOT NULL
         )
      `);
      return await executeQuery(`
         CREATE TABLE IF NOT EXISTS booking (
            id INT PRIMARY KEY AUTO_INCREMENT,
            idType INT NOT NULL,
            date DATE NOT NULL,
            hour INT NOT NULL,
            name VARCHAR(50),
            FOREIGN KEY (idType) REFERENCES type(id)
         )
      `);
   },
   insert: async (booking) => {

      console.log("BOOKING RICEVUTO:", booking);

      let sql = `
         INSERT INTO booking(idType, date, hour, name)
         VALUES ('${booking.idType}','${booking.date}', '${booking.hour}', '${booking.name}')
           `;
      await executeQuery(sql);
   },
   delete: (id) => {//eliminare anche in type
      let sql = `
        DELETE FROM booking
        WHERE id=${id}
           `;
      return executeQuery(sql);
   },
   select: async () => {
      let sql = `
        SELECT id, idType, date, hour, name
        FROM booking 
           `;
      let result = await executeQuery(sql);
      console.log("rrrrrr:",result)
      sql = `
         SELECT id,name
         FROM type
      `;
      const list = await executeQuery(sql);
      return {result,list};
   },
   drop: async () => {
      let sql = `
            DROP TABLE IF EXISTS type
           `;
      await executeQuery(sql);
      sql = `
            DROP TABLE IF EXISTS booking
           `;
      await executeQuery(sql);
   }
}

module.exports = database;