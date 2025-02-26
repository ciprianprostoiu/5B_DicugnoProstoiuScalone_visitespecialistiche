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
      let sql = `
         INSERT INTO booking(idType, date, hour, name)
         VALUES (
            ${booking.idType}, 
            '${booking.date}', 
            ${booking.hour}, 
            '${booking.name}'
            )
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
   select: async () => {//non è prevista una mappa////////////////////////////////////////////////////
      let sql = `
        SELECT id, address, date, time, injured, dead
        FROM accident 
           `;
      const result = await executeQuery(sql);
      await Promise.all(result.map(async (accident) => {
         sql = `
            SELECT plate
            FROM plates
            WHERE idAccident=${accident.id} 
           `;
         const list = await executeQuery(sql);
         accident.plates = list.map(p => p.plate);
      }));
      return result;
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