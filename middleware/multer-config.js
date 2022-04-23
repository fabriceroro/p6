// Utilisation de multer pour enregistrer les fichiers images
const multer = require('multer');

// Modification de l'extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // Enregistrement dans le dossier "images"
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Génération du nom du fichier : nom d'origine + numero unique + . + extension
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);// Genère le nom complet du fichier- Nom d'origine + numero unique + . + extension
    }
});
// On export le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage }).single('image');