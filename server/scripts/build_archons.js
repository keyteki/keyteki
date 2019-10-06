//build buildAllFiles will build every permutation of the supplied houses and language provided
//buildArchon needs [house1, house2, house3, lang, 1] to build a specific archon cardback
//the file name is btoa(card.join()).png
// `node server/scripts/build_archons.js`  to only build only en languages
// `node server/scripts/build_archons.js -l en de`  to only build specific languages
// `node server/scripts/build_archons.js -l all`  to build all languages
// the script will drop all the files into public/img/idbacks/archons and no further moving is necessary

const {createCanvas, loadImage, registerFont} = require('canvas');
const fs = require('fs');
const Path = require('path');
const commandLineArgs = require('command-line-args');

const lanugageJSON = {
    brobnar: {
        en: 'Brobnar',
        zhhant: '蠻族',
        zhhans: '蛮族',
        pt: 'Brobnar',
        fr: 'Brobnar',
        es: 'Brobnar',
        de: 'Brobnar',
        it: 'Brobnar',
        pl: 'Brobnar',
        th: 'บรอบนาร์'
    },
    dis: {
        en: 'Dis',
        zhhant: '冥府',
        zhhans: '冥府',
        pt: 'Dis',
        fr: 'Dis',
        es: 'Dis',
        de: 'Dis',
        it: 'Dis',
        pl: 'Dis',
        th: 'ดิส'
    },
    logos: {
        en: 'Logos',
        zhhant: '邏機',
        zhhans: '逻机',
        pt: 'Logos',
        fr: 'Logos',
        es: 'Logos',
        de: 'Logos',
        it: 'Logos',
        pl: 'Logos',
        th: 'โลโกส์'
    },
    mars: {
        en: 'Mars',
        zhhant: '火星',
        zhhans: '火星',
        pt: 'Marte',
        fr: 'Mars',
        es: 'Marte',
        de: 'Mars',
        it: 'Marte',
        pl: 'Mars',
        th: 'มาร์ส'
    },
    sanctum: {
        en: 'Sanctum',
        zhhant: '聖堂',
        zhhans: '圣堂',
        pt: 'Santuário',
        fr: 'Sanctum',
        es: 'Sanctum',
        de: 'Sanctum',
        it: 'Sanctum',
        pl: 'Sanctum',
        th: 'แซงค์ทัม'
    },
    shadows: {
        en: 'Shadows',
        zhhant: '暗影',
        zhhans: '暗影',
        pt: 'Sombras',
        fr: 'Ombres',
        es: 'Sombras',
        de: 'Schatten',
        it: 'Ombre',
        pl: 'Cienie',
        th: 'แชโดวส์'
    },
    untamed: {
        en: 'Untamed',
        zhhant: '狂獸',
        zhhans: '狂兽',
        pt: 'Indomados',
        fr: 'Indomptés',
        es: 'Indómita',
        de: 'Ungezähmte',
        it: 'Selvaggi',
        pl: 'Nieokiełznani',
        th: 'อันเทม'
    },
    staralliance: {
        en: 'Star Alliance',
        zhhant: 'Star Alliance',
        zhhans: 'Star Alliance',
        pt: 'Star Alliance',
        fr: 'Star Alliance',
        es: 'Star Alliance',
        de: 'Star Alliance',
        it: 'Star Alliance',
        pl: 'Star Alliance',
        th: 'Star Alliance'
    },
    saurian: {
        en: 'Saurian',
        zhhant: 'Saurian',
        zhhans: 'Saurian',
        pt: 'Saurian',
        fr: 'Saurian',
        es: 'Saurian',
        de: 'Saurian',
        it: 'Saurian',
        pl: 'Saurian',
        th: 'Saurian'
    }
};
const houses = ['brobnar', 'dis', 'logos', 'mars', 'sanctum', 'shadows', 'saurian', 'staralliance', 'untamed'];
const allLanguages = ['en', 'zhhant', 'zhhans', 'pt', 'fr', 'es', 'de', 'it', 'pl', 'th'];
const optionDefinitions = [
    { name: 'language', alias: 'l', type: String, multiple: true }
];

const buildArchon = (card) => new Promise(cardResolve => {
    const number = card[4];
    const path = Path.resolve(__dirname, '../../public/img/idbacks/archons', `${ Buffer.from(card.join()).toString('base64') }.png`);
    if(fs.existsSync(path)) {
        // eslint-disable-next-line no-console
        console.log('File Exists, moving on!');
        cardResolve();
        return;
    }
    const houseNames = [{x: -305, y: 720}, {x: -125, y: 770}, {x: 55, y: 720}];
    const canvas = createCanvas(600, 840);
    const ctx = canvas.getContext('2d');
    let promises = [];

    promises.push(loadImage(Path.join(__dirname, `./archon_blanks/archon_${ number }.png`)));
    promises.push(loadImage(Path.join(__dirname, `./archon_houses/${ card[0] }.png`)));
    promises.push(loadImage(Path.join(__dirname, `./archon_houses/${ card[1] }.png`)));
    promises.push(loadImage(Path.join(__dirname, `./archon_houses/${ card[2] }.png`)));
    Promise.all(promises).then(([cardBack, house1, house2, house3]) => {
        ctx.drawImage(cardBack, 0, 0);
        ctx.drawImage(house1, 45, 590, 150, 150);
        ctx.drawImage(house2, 225, 640, 150, 150);
        ctx.drawImage(house3, 405, 590, 150, 150);
        card.slice(0, 3).forEach((house, index) => {
            ctx.drawImage((getCircularText(lanugageJSON[house][card[3]], 850, 0)), houseNames[index].x, houseNames[index].y);
        });
        fs.writeFile(path, canvas.toBuffer('image/jpeg', { quality: 0.7 }), () => cardResolve());
    });
});
const permute = (languages) => {
    let final = [];
    for(let a = 0; a < houses.length; a++) {
        for(let b = 0; b < houses.length; b++) {
            if(a !== b) {
                for(let c = 0; c < houses.length; c++) {
                    if(c !== a && c !== b) {
                        for(let d = 0; d < languages.length; d++) {
                            for(let i = 1; i < 8; i++) {
                                final.push([houses[a], houses[b], houses[c], languages[d], i]);
                            }
                        }
                    }
                }
            }
        }
    }
    return final;
};

const buildAllFiles = async () => {
    const options = commandLineArgs(optionDefinitions);
    if(!options.language) {
        options.language = ['en'];
    }
    if(options.language[0] === 'all') {
        options.language = allLanguages;
    }
    new registerFont(Path.join(__dirname, '../../public/fonts/Oswald-Regular.ttf'), {family: 'Keyforge'});
    new registerFont(Path.join(__dirname, '../../public/fonts/ZCOOL-Regular.ttf'), {family: 'Keyforge'});
    new registerFont(Path.join(__dirname, '../../public/fonts/Kanit-Regular.ttf'), {family: 'Keyforge'});
    const cards = permute(options.language);
    for(let i = 0; i < cards.length; i++) {
        // eslint-disable-next-line no-console
        console.log(`Building ${ i } ${ cards[i] }.  ${cards.length - i} cards to go!`);
        await buildArchon(cards[i]);
    }
};

const getCircularText = (text = '', diameter, kerning) => {
    let canvas = createCanvas(0, 0);
    let ctx = canvas.getContext('2d');
    let textHeight = 40, startAngle = 0;

    canvas.width = diameter;
    canvas.height = diameter;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'grey';
    ctx.font = 'bold 20px Keyforge';

    text = text.split('').reverse().join('');

    ctx.translate(diameter / 2, diameter / 2); // Move to center
    ctx.textBaseline = 'middle'; // Ensure we draw in exact center
    ctx.textAlign = 'center'; // Ensure we draw in exact center

    for(let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width;
        startAngle += ((charWid + (j === text.length - 1 ? 0 : kerning)) / (diameter / 2 - textHeight)) / 2;
    }

    ctx.rotate(startAngle);

    for(let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width; // half letter
        ctx.rotate((charWid / 2) / (diameter / 2 - textHeight) * -1);
        ctx.fillText(text[j], 0, (0 - diameter / 2 + textHeight / 2));
        ctx.rotate((charWid / 2 + kerning) / (diameter / 2 - textHeight) * -1); // rotate half letter
    }
    return canvas;
};

buildAllFiles().catch();
