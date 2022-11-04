// Importation du schéma créé préalablement pour les sauces Moongoose
const Sauce = require('../models/sauces'); 

//Déclaration "fs" -> permet de supprimer les fichier images
const fs = require('fs');

const { cpuUsage } = require('process'); // ?

// Création de la sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // -> passe d'un objet reçu du front en chaine de caractére à un objet utilisable

  delete sauceObject._id; //-> suppression de l'ID qui sera identifié par Moongoose
  delete sauceObject.userId; // -> suppression de l'ID utilisateur (non fiable)

  // création nouvel objet
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
              // http :// localhost:3000 /images/ nom de l'image ajouté 
              userId : req.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  // --> enregistrement du nouvel objet
  sauce.save()
  .then(() => res.status(201).json({ message : 'Sauce enregistrée !'}))
  .catch(error => {
    console.log(sauce);
    console.log(error);
    res.status(400).json({ error });
  });
};

// Afficher tous les objets
exports.sauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};

// Afficher l'objet au click
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }));
};

// Modifier un objet
exports.modifySauce = (req, res, next) => {
  
  
  const sauceObject = req.file ? // vérification si l'image a été modifiée lors de la modification - utilisation de l'opérateur ternaire oui/non
  // -> la requête est vrai et donc qu'il existe les 4 lignes ci-dessous sont prise en compte
  {
    ...JSON.parse(req.body.sauce), // -> traduction de l'image en chaine de caractère (reçu du frontend) en objet js exploitable (d'où le json.parse)

    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }; // -> si  la requête est fausse et n'existe pas, on reprend juste l'ensemble de ce qu'envoi le front sans parser

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // -> 1er paramètre et 2nd paramétre avec les nouvelles données à enregistrer dans la base de donée
  .then(() => res.status(200).json({ message : 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // -> on cherche l'id qui correspond à celui qu'on veut supprimé (envoyé par la requête front)

  .then(sauce => { // -> il nous renvoie la sauce en question à surpprimer
    const filename = sauce.imageUrl.split('/images/')[1]; // -> récupération du nom,on split la chaine de caractères au niveau de images puis on prend la 2nd valeur

    fs.unlink(`images/${filename}`, () => { // -> utilisation de la fonciton de fs 'unlike' pour supprimer un fichier ( prend en guise de paramétre le dossier et le nom de l'image)
      Sauce.deleteOne({ _id: req.params.id }) // -> dans callback de fs.unlike ( supression de l'image fait, supression du reste des info de la sauce

      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

// Modification de la sauce
exports.setStatut = (req, res, next) => {
  const like = req.body.like; // -> aucune image à traiter
  const userId = req.body.userId;
  // récupération des éléments envoyés par le front lors de la requête

  Sauce.findOne({ _id: req.params.id }) // parametre de recherche de l'objet
  .then(sauce => { // traitement du resultat de recherche
    //-> utilisation d'un switch pour les 3 cas possible: like = 1, like = 0 et like = -1
    switch (like) {
      case 1: // cas n°1 : like = 1
      if ( sauce.usersLiked.includes(userId) ) { // si l'id utilisateur est déjà présent on ne fait rien - renvoi un mess. d'erreur
        alert('message: votre sauce est déjà enregistré dans vos likes');
      } else { // si l'utilisateur n'est pas présent dans le tableau userLiked : on rajoute 1 au like de la sauce et on ajoute son userId dans le tableau
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 },  $push: { usersLiked: userId } })
                                        // $inc est une fonction mongoose qui permet d'incrémenter & $push permet d'ajouter une donnée dans un tableau
        .then(() => res.status(200).json({ message : 'Like ajouté !'}))
        .catch(error => res.status(400).json({ error }));
      }
      break;

      case -1:
      if ( sauce.usersDisliked.includes(userId) ) {
        alert('message: votre sauce est déjà enregistré dans vos disLikes');
      } else {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 },  $push: { usersDisliked: userId } })
        .then(() => res.status(200).json({ message : 'Dislike ajouté !'}))
        .catch(error => res.status(400).json({ error }));
      }
      break;

      case 0:
      if ( sauce.usersLiked.includes(userId) ) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1},  $pull: { usersLiked: userId } })
        .then(() => res.status(200).json({ message : 'Like retiré !'}))
        .catch(error => res.status(400).json({ error }));
      } else {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1},  $pull: { usersDisliked: userId } })
        .then(() => res.status(200).json({ message : 'Like retiré !'}))
        .catch(error => res.status(400).json({ error }));
      }
      

    }
  })
  .catch(error => res.status(400).json({ error }));

};