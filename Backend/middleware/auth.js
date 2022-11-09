// middleware d'authentification 

const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // séparation du token créé au niveau de l'espace et on prend la 2nd valeur
        //  ->  fin du BEARED
        const decodedToken = jwt.verify(token, process.env.TOKEN); // -> vérification que le token correspond à ce qui a était rentré
        const userId = decodedToken.userId; // -> récupération de l'idToken (il est comme un objet js)

        req.userId = userId;

        if(req.body.userId && req.body.userId !== userId){ // si les users id ne correspondent pas, un message d'erreur doit apparaître 
            throw 'User Id non valable !';
        } else {
            next(); // si la requête fonctionne, on passe à la suite
        }
    }
    catch {
        res.status(401).json({ error: error | 'Utilisateur non authentifié !' })
    }
};