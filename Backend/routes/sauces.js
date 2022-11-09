const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // rappatriation du middleware auth (utilisateur reconnu et non malveillant) pour l'authentification de nos routes
const multer = require('../middleware/multer-config'); // rappatriation du middleware multer pour la gestion des images

const saucesCtrl = require('../controllers/sauces');

router.post('/', auth, multer, saucesCtrl.createSauce); 
// + saucesCtrl.createSauce pour récupérer le controller de la route
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.sauces);
router.post('/:id/like', auth, saucesCtrl.setStatut);

module.exports = router;