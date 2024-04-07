const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const photosDir = process.env.PHOTO_DIR || '/photos';
const outputJson = process.env.JSON_DIR ? path.join(process.env.JSON_DIR, 'images.json') : '/json/images.json';

// Function to update JSON file with image list
function updateImageList() {
  fs.readdir(photosDir, (err, files) => {
    if (err) {
      console.error('Error reading photo directory:', err);
      return;
    }

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    fs.writeFile(outputJson, JSON.stringify(imageFiles, null, 2), err => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Updated image list JSON.');
      }
    });
  });
}

// Initial update
updateImageList();

// Watch for changes in the directory
const watcher = chokidar.watch(photosDir, {ignored: /^\./, persistent: true});

watcher.on('add', updateImageList).on('unlink', updateImageList);
