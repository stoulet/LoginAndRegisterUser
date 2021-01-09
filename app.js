//import du module express
const express = require('express');

//import du module body-parser pour récupérer les données postées
const bodyParser = require('body-parser');

//import du module sha1
const sha1 = require('sha1');

//import du module json web token
const jwt = require('jsonwebtoken');

//import de la connexion à la bd 
const mysql = require('./database/mysql');

//clef secrète pour JWT
const jwtSecret = 'applicationloginregister';

//création de l'application
const app = express();

//middlewares qui s'appliqueront à toutes les routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use(express.static('assets'));
app.set('view engine', 'pug');

//route index
app.get('/', (req, res) => {
    res.render('index');
});

//route register
app.post('/register', async (req, res) => {
    //connexion à la bd
    const cn = await mysql.db;
    const user = {
        login: req.body.login,
        username: req.body.username,
        pwd: sha1(req.body.pwd),
    };
    //envoie de la requête pour insérer les données ut
    const response = await cn.query('INSERT INTO users SET ?', user);
    const id = response[0].insertId;
    user.id = id;

    //signature du token
    const token = jwt.sign(user, jwtSecret);
    //envoi de la réponse au format json en transmettant le user et le token
    res.status(200).json({ user: user, token: token });
});

//route login
app.post('/login', async (req, res) => {
    try {
        const cn = await mysql.db;
        const response = await cn.query(
            'SELECT * FROM users WHERE login=? AND pwd=SHA1(?)',
            [req.body.login, req.body.pwd]
        );
        //les données sont dans un tableau de tableau contenant un objet
        const data = response[0][0];
        const isFound = response[0].length > 0;
        if (isFound) {
            const user = {
                login: data.login,
                username: data.username,
                id: data.id,
            };
            //création du token
            token = jwt.sign(user, jwtSecret);
            res.status(200).json({ user: user, token: token });
        } else {
            //requête vide = statut 401
            res.status(401).json({ error: 'utilisateur non trouvé' });
        }
    } catch (err) {
        //erreur interne du serveur
        res.status(500).json({ error: err });
    }
});

//middleware pour la gestion des autorisations
//fonction qui extraie la partie token sans bearer 
const extractToken = req => {
    let token = null; 
    if (typeof req.headers.authorization == 'string') {
      const parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        token = parts[1];
      }
    } 
    return token;
  };
  app.use(async (req, res, next) => {
    const token = extractToken(req);
    try {
        //vérification du token
      const decoded = await jwt.verify(token, jwtSecret);
      req.user = decoded;
      req.token = token;
      next();
    } catch (err) {
      res.status(403).json({ error: err });
    }
  });

//lancement de l'application
app.listen(3000, () => console.log('app started'));