import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputFolder = 'C:\\Users\\Bruno\\Downloads\\bs\\gadgets\\bibi'; // Your input folder
const outputFolder = path.join(inputFolder, 'converted-webp'); // Output folder inside the same directory

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Error reading input folder:', err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.png') {
            const inputPath = path.join(inputFolder, file);
            const outputPath = path.join(outputFolder, `${path.basename(file, '.png')}.webp`);

            sharp(inputPath)
                .toFormat('webp')
                .toFile(outputPath)
                .then(() => console.log(`Converted ${file} -> ${outputPath}`))
                .catch(err => console.error(`Error converting ${file}:`, err));
        }
    });
});
