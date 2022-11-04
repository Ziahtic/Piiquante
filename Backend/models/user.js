const mongoose = require('mongoose');

//Interprétation des erreurs par Moongoose
const MongooseErrors = require('mongoose-errors');

const uniqueValidator = require('mongoose-unique-validator'); // -> Plug-in pour éviter les erreurs sur mongoose

// Schéma depuis Moongoose
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // -> En mettant juste unique: true on risque d'avoir des erreurs sur mongoose...
    password: { type: String, required: true },
  });
  
  userSchema.plugin(MongooseErrors);
  
  userModel = mongoose.model("userModel", userSchema);
  userModel.create().catch((error) => {
    console.log(error.statusCode);
    done();
  });

userSchema.plugin(uniqueValidator); //  -> On applique le module (adresse email doit être unique) au schéma avec de l'exporter

//Exportation du model sous le format schéma
module.exports = mongoose.model('User', userSchema);