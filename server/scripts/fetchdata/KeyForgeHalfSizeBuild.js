const fabric = require('fabric').fabric;
const fs = require('fs');
const path = require('path');
const loadImage = (imgPath) => {
    return new Promise((resolve) => fabric.Image.fromURL(imgPath, (image) => resolve(image)));
};
const parameters = {
    action: { top: 0, height: 250, width: 297.5 },
    artifact: { top: 0, height: 250, width: 297.5 },
    creature: { top: 0, height: 490, width: 297.5 },
    ['token creature']: { top: 0, height: 490, width: 297.5 },
    ['the tide']: { top: 0, height: 490, width: 297.5 },
    creature1: { top: -5, height: 380, width: 417.5 },
    upgrade: { top: -140, height: 225, width: 297.5 }
};
const shadowProps = {
    color: 'Black',
    offsetX: 3,
    offsetY: 3,
    blur: 4
};
const assetsPath = path.join(__dirname, './assets');

fabric.nodeCanvas.registerFont(path.join(__dirname, './fonts/TeutonNormal-Bold.otf'), {
    family: 'TeutonFett',
    weight: 'bold',
    style: 'normal'
});
fabric.nodeCanvas.registerFont(path.join(__dirname, './fonts/Bombardier.ttf'), {
    family: 'Bombardier',
    weight: 'regular',
    style: 'normal'
});
fabric.nodeCanvas.registerFont(path.join(__dirname, './fonts/ZCOOL-Regular.ttf'), {
    family: 'TeutonFett',
    weight: 'regular',
    style: 'normal'
});
fabric.nodeCanvas.registerFont(path.join(__dirname, './fonts/Kanit-Regular.ttf'), {
    family: 'TeutonFett',
    weight: 'regular',
    style: 'normal'
});
fabric.nodeCanvas.registerFont(path.join(__dirname, './fonts/Kanit-Bold.ttf'), {
    family: 'TeutonFett',
    weight: 'bold',
    style: 'normal'
});

const buildHalfSize = async (card, imgPath, filename, language) => {
    const canvas = new fabric.StaticCanvas(null, {
        width: parameters[card.type].width,
        height: parameters[card.type].height
    });
    const canvasFinal = new fabric.StaticCanvas(null, { width: 300, height: 262.5 });
    let framePath = assetsPath + `/${card.house}_Frame`;
    if (card.type === 'upgrade') framePath += '_b';
    else if (card.type.includes('creature')) framePath += '_c';
    else if (card.type === 'action') framePath += '_c';
    framePath += '.png';

    const frame = await loadImage(`file://${framePath}`);
    frame.scaleToWidth(300);
    const art = await loadImage(imgPath);
    const artCanvas = new fabric.Image(art.toCanvasElement());
    artCanvas.set({ top: parameters[card.type].top, left: 150, originX: 'center' });

    if (card.type === 'creature1' || card.type === 'creature2') {
        artCanvas.scaleToWidth(297.5);
        artCanvas.set({ top: parameters[card.type].top, left: 210, originX: 'center' });
    }
    canvas.add(artCanvas);
    canvas.renderAll();
    const finalArt = new fabric.Image(canvas.toCanvasElement(), { left: 150, originX: 'center' });
    if (card.type === 'upgrade') finalArt.set({ top: 19 });
    canvasFinal.add(finalArt);
    canvasFinal.add(frame);
    let bar;
    let barCanvas;
    let Power;
    let Armor;
    let Name = new fabric.Text(card.locale[language].name, {
        fill: '#fdfbfa',
        fontFamily: 'TeutonFett',
        textAlign: 'center',
        fontSize: 20,
        shadow: new fabric.Shadow(shadowProps)
    });
    let cardType = new fabric.Text(
        card.type === 'creature1' ? 'CREATURE' : card.type.toUpperCase(),
        {
            fill: '#fdfbfa',
            shadow: new fabric.Shadow({ ...shadowProps, offsetX: 1, offsetY: 1, blur: 1 }),
            fontFamily: 'TeutonFett',
            textAlign: 'center',
            fontSize: 8
        }
    );
    switch (card.type) {
        case 'action':
            Name.set({
                originX: 'center',
                originY: 'center',
                left: 150,
                top: 223.5,
                angle: -6.5,
                centeredRotation: true
            });
            cardType.set({
                originX: 'center',
                originY: 'center',
                left: 150,
                top: 247,
                angle: -6.5,
                centeredRotation: true
            });

            bar = await loadImage(`file://${assetsPath + `/${card.house}_Action.png`}`);
            barCanvas = new fabric.Image(bar.toCanvasElement()).set({
                originX: 'center',
                originY: 'center',
                top: 230,
                left: 150
            });
            barCanvas.scaleToWidth(265);
            canvasFinal.add(barCanvas);
            canvasFinal.add(Name);
            canvasFinal.add(cardType);
            break;
        case 'creature':
        case 'creature1':
            bar = await loadImage(
                `file://${
                    assetsPath +
                    `/${card.house}_${card.rarity === 'Evil Twin' ? 'eviltwin' : 'Creature'}.png`
                }`
            );
            barCanvas = new fabric.Image(bar.toCanvasElement()).set({
                originX: 'center',
                originY: 'center',
                top: card.rarity === 'Evil Twin' ? 224 : 230,
                left: 150
            });
            barCanvas.scaleToWidth(270);
            Name = getCircularText(card.locale[language].name, 1200);
            cardType.set({ originX: 'center', originY: 'center', left: 150, top: 242.5 });
            Power = new fabric.Text(card.power ? card.power.toString() : '0', {
                fill: '#fdfbfa',
                fontSize: 37.5,
                shadow: new fabric.Shadow(shadowProps),
                fontFamily: 'Bombardier',
                fontWeight: 800,
                textAlign: 'center',
                stroke: 'black',
                strokeWidth: 1
            });
            Armor = new fabric.Text(card.armor > 0 ? card.armor.toString() : '~', {
                fill: '#fdfbfa',
                fontSize: 37.5,
                shadow: new fabric.Shadow(shadowProps),
                fontFamily: 'Bombardier',
                fontWeight: 800,
                textAlign: 'center',
                stroke: 'black',
                strokeWidth: 1
            });
            Name.set({ originX: 'center', left: 150, top: 200 });
            Power.set({ originX: 'center', originY: 'center', left: 38, top: 231.25 });
            Armor.set({
                originX: 'center',
                originY: 'center',
                left: 262,
                top: card.armor > 0 ? 231.25 : 241.25
            });
            canvasFinal.add(barCanvas, Name, Power, Armor, cardType);
            if (card.rarity === 'Evil Twin') {
                let EvilTwin = new fabric.Text('EVIL TWIN', {
                    fill: '#fdfbfa',
                    shadow: new fabric.Shadow({ ...shadowProps, offsetX: 1, offsetY: 1, blur: 1 }),
                    fontFamily: 'TeutonFett',
                    textAlign: 'center',
                    fontSize: 8
                });
                EvilTwin.set({ originX: 'center', left: 150, top: 196 });
                canvasFinal.add(EvilTwin);
            }
            break;
        case 'artifact':
            Name = getCircularText(card.locale[language].name, 1200);
            bar = await loadImage(`file://${assetsPath + `/${card.house}_Upgrade.png`}`);
            if (card.house === 'untamed') {
                barCanvas = new fabric.Image(bar.toCanvasElement()).set({
                    originX: 'center',
                    originY: 'center',
                    top: 40,
                    left: 150
                });
                barCanvas.scaleToWidth(270);
                Name.set({ originX: 'center', left: 153, top: 13 });
                cardType.set({ originX: 'center', originY: 'center', left: 153, top: 55 });
            } else {
                barCanvas = new fabric.Image(bar.toCanvasElement()).set({
                    originX: 'center',
                    originY: 'center',
                    top: 40,
                    left: 150
                });
                barCanvas.scaleToWidth(280);
                Name.set({ originX: 'center', left: 153, top: 13 });
                cardType.set({ originX: 'center', originY: 'center', left: 153, top: 56 });
            }
            canvasFinal.add(barCanvas);
            canvasFinal.add(Name);
            canvasFinal.add(cardType);
            break;
        case 'upgrade':
            Name = getCircularText(card.locale[language].name, 1200);
            bar = await loadImage(`file://${assetsPath + `/${card.house}_Upgrade.png`}`);
            if (card.house === 'untamed') {
                barCanvas = new fabric.Image(bar.toCanvasElement()).set({
                    originX: 'center',
                    originY: 'center',
                    top: 39,
                    left: 150
                });
                barCanvas.scaleToWidth(270);
                Name.set({ originX: 'center', left: 153, top: 13 });
                cardType.set({ originX: 'center', originY: 'center', left: 153, top: 54 });
            } else {
                barCanvas = new fabric.Image(bar.toCanvasElement()).set({
                    originX: 'center',
                    originY: 'center',
                    top: 41,
                    left: 150
                });
                barCanvas.scaleToWidth(280);
                Name.set({ originX: 'center', left: 153, top: 15 });
                cardType.set({ originX: 'center', originY: 'center', left: 153, top: 56 });
            }
            canvasFinal.add(barCanvas);
            canvasFinal.add(Name);
            canvasFinal.add(cardType);
            break;
    }

    if (card.amber) {
        const amber = await loadImage(
            `file://${assetsPath + `/${card.house}_Aember_Bonus_${card.amber}.png`}`
        );
        amber.set({ top: 57.5, left: 17.5 });
        amber.scaleToHeight(172.5);
        canvasFinal.add(amber);
    }

    canvasFinal.renderAll();
    const stream = canvasFinal.createJPEGStream();
    const out = fs.createWriteStream(filename);
    stream.on('data', (chunk) => {
        out.write(chunk);
    });
    stream.on('end', () => {
        console.log('Built Half Sized image for ' + card.name + ': ' + card.locale[language].name);
        canvasFinal.dispose();
    });
};

const getCircularText = (text = '', diameter, yOffset = 0) => {
    const canvas = fabric.util.createCanvasElement();

    let ctx = canvas.getContext('2d');
    let textHeight = 40,
        startAngle = 0;
    canvas.width = 300;
    canvas.height = 262.5;
    ctx.fillStyle = '#fdfbfa';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = -1.5;
    ctx.shadowOffsetY = 5;
    ctx.font = `${getCurvedFontSize(text.length)}px TeutonFett`;
    ctx.fontWeight = 'bold';

    text = text.split('').reverse().join('');

    ctx.translate(150, Math.max((diameter + yOffset) / 2, 400 + yOffset)); // Move to center
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

const getCurvedFontSize = (length) => {
    if (length < 20) return 20;
    return (20 / length) * 20;
};

module.exports = buildHalfSize;
