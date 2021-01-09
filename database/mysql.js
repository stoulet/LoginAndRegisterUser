//import du module pour gérer les promesses avec mysql
const mysql = require('mysql2/promise');

//paramètres de connexion à la bd
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sql_2020',
});

//requête qui permet de récupérer les données de la bd
const query = async (sql, params, res) => {
  try {
    const cn = await db;
    const response = await cn.query(sql, params);
    const data = response[0];
    res.status(200).json(data);
  } catch (err) {
    res.status(500, { error: err });
  }
};

//export des modules
module.exports = {
  query,
  db,
};
