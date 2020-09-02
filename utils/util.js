var fs = require('fs');
const axios = require('axios').default;

const downloadImage = (url, imagePath) => {
  try {
    fs.statSync(imagePath).isFile();
  } catch {
    let dir = imagePath.slice(0, imagePath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    axios({
      url,
      responseType: 'stream',
    }).then(
      (response) => {
        return new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(imagePath))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
        });
      }
    ).catch((err) => err);
  }
};

module.exports = {
  downloadImage: downloadImage,
};