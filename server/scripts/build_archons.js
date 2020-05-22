//build buildAllFiles will build every permutation of the supplied houses and language provided
//buildArchon needs [house1, house2, house3, lang, 1] to build a specific archon cardback
//the file name is btoa(card.join()).png
// `node server/scripts/build_archons.js`  to only build only en languages
// `node server/scripts/build_archons.js -l en de`  to only build specific languages
// `node server/scripts/build_archons.js -l all`  to build all languages
// the script will drop all the files into public/img/idbacks/archons and no further moving is necessary

const fabric = require('fabric').fabric;
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
const houses = [
    'brobnar',
    'dis',
    'logos',
    'mars',
    'sanctum',
    'shadows',
    'saurian',
    'staralliance',
    'untamed'
];
const allLanguages = ['en', 'zhhant', 'zhhans', 'pt', 'fr', 'es', 'de', 'it', 'pl', 'th'];
const optionDefinitions = [{ name: 'language', alias: 'l', type: String, multiple: true }];

const buildArchon = async (card) => {
    const houses = card.slice(0, 3);
    const language = card[3];
    const number = card[4];
    const path = Path.resolve(
        __dirname,
        '../../public/img/idbacks/archons',
        `${Buffer.from(card.join()).toString('base64')}.png`
    );
    if (fs.existsSync(path)) {
        // eslint-disable-next-line no-console
        console.log('File Exists, moving on!');
        return;
    }

    const houseNames = [
        { x: 120, y: 720 },
        { x: 300, y: 770 },
        { x: 480, y: 720 }
    ];
    const canvas = new fabric.StaticCanvas(null, { width: 600, height: 840 });
    const background = await loadImage(`./archon_blanks/archon_${number}.png`);
    let house1 = await loadImage(`./archon_houses/${houses[0]}.png`);
    let house2 = await loadImage(`./archon_houses/${houses[1]}.png`);
    let house3 = await loadImage(`./archon_houses/${houses[2]}.png`);

    house1.scaleToWidth(150);
    house2.scaleToWidth(150);
    house3.scaleToWidth(150);
    house1.set({ left: 45, top: 590 });
    house2.set({ left: 225, top: 640 });
    house3.set({ left: 405, top: 590 });
    canvas.add(background);
    canvas.add(house1);
    canvas.add(house2);
    canvas.add(house3);
    for (let [index, house] of houses.entries()) {
        const name = getCircularText(lanugageJSON[house][language], 1400, 0);
        name.set({ originX: 'center', top: houseNames[index].y, left: houseNames[index].x });
        canvas.add(name);
    }

    canvas.renderAll();
    let dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
    let base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

    fs.writeFile(path, base64Data, 'base64', () => {
        // eslint-disable-next-line no-console
        console.log(`Building ${card}`);
    });
};

const permute = (languages) => {
    let final = [];
    for (let a = 0; a < houses.length; a++) {
        for (let b = 0; b < houses.length; b++) {
            if (a !== b) {
                for (let c = 0; c < houses.length; c++) {
                    if (c !== a && c !== b) {
                        for (let d = 0; d < languages.length; d++) {
                            for (let i = 1; i < 8; i++) {
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
    if (!options.language) {
        options.language = ['en'];
    }

    if (options.language[0] === 'all') {
        options.language = allLanguages;
    }

    fabric.nodeCanvas.registerFont(Path.join(__dirname, '../../public/fonts/Oswald-Regular.ttf'), {
        family: 'Keyforge'
    });

    fabric.nodeCanvas.registerFont(Path.join(__dirname, '../../public/fonts/ZCOOL-Regular.ttf'), {
        family: 'Keyforge'
    });
    fabric.nodeCanvas.registerFont(Path.join(__dirname, '../../public/fonts/Kanit-Regular.ttf'), {
        family: 'Keyforge'
    });

    const cards = permute(options.language);
    const path = Path.resolve(__dirname, '../../public/img/idbacks/archons');
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    for (let card of cards) {
        await buildArchon(card);
    }
};

const getCircularText = (text = '', diameter, yOffset = 0) => {
    const canvas = fabric.util.createCanvasElement();

    let ctx = canvas.getContext('2d');
    let textHeight = 40;
    let startAngle = 0;
    canvas.width = 600;
    canvas.height = 525;
    ctx.fillStyle = '#fdfbfa';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = -1.5;
    ctx.shadowOffsetY = 5;
    ctx.font = `20px Keyforge`;

    text = text.split('').reverse().join('');

    ctx.translate(300, Math.max((diameter + yOffset) / 2, 400 + yOffset)); // Move to center
    ctx.textBaseline = 'middle'; // Ensure we draw in exact center
    ctx.textAlign = 'center'; // Ensure we draw in exact center

    for (let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width;
        startAngle += charWid / (diameter / 2 - textHeight) / 2;
    }

    ctx.rotate(startAngle);

    for (let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width; // half letter
        ctx.rotate((charWid / 2 / (diameter / 2 - textHeight)) * -1);
        ctx.fillText(text[j], 0, 0 - diameter / 2 + textHeight / 2);
        ctx.rotate((charWid / 2 / (diameter / 2 - textHeight)) * -1); // rotate half letter
    }

    return new fabric.Image(canvas, { left: 0, top: 0 });
};

const loadImage = (imgPath) => {
    return new Promise((resolve) => {
        fabric.Image.fromURL(`file://${Path.join(__dirname, imgPath)}`, (image) => {
            resolve(image);
        });
    });
};

buildAllFiles();
