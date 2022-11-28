const express = require("express");
const router = express.Router();

// J'importe mes fichiers multer-config et auth du dossier middleware, ainsi que mon fichier sauce du dossier controllers
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const sauceCtrl = require("../controllers/sauce");

// Routers qui contiennent toutes les informations pour les sauces et les likes qui vont êtres récupéré, ajouté, modifié ou supprimé dans la base
router.get("/", auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;