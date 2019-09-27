import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

import { withTranslation } from 'react-i18next';

class IdentityCard extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.state = {imageUrl: ''};
    }

    componentDidMount() {
        this.buildIdentityCard();
    }

    componentDidUpdate(prevProps) {
        if(this.props.language !== prevProps.language) {
            this.buildIdentityCard();
        }
    }

    buildIdentityCard() {
        if(this.props.cards && this.props.deckCards) {
            if(this.props.deckCards.length > 0) {
                this.buildDeckList();
            } else {
                this.buildArchon();
            }
        }
    }

    buildDeckList() {
        const canvas = createCanvas(600, 840);
        const ctx = canvas.getContext('2d');
        const cardBack = loadImage('/img/idbacks/decklist.png');
        const Common = loadImage('/img/idbacks/Common.png');
        const Uncommon = loadImage('/img/idbacks/Uncommon.png');
        const Rare = loadImage('/img/idbacks/Rare.png');
        const Special = loadImage('/img/idbacks/Special.png');
        const maverick = loadImage('/img/idbacks/Maverick.png');
        const legacy = loadImage('/img/idbacks/Legacy.png');
        const houseData = {
            size: 35,
            0: {x: 55, y: 120},
            1: {x: 55, y: 498},
            2: {x: 310, y: 215}
        };
        const cardData = {
            size: 20,
            start: {x: 60, y: 185}
        };
        const qrCode = new Promise(resolve => {
            QRCode.toDataURL(`https://www.keyforgegame.com/${ this.props.deckUuid.length > 0 ? 'deck-details/' + this.props.deckUuid : '' }`, {margin: 0})
                .then(async url => {
                    loadImage(url).then(image => {
                        resolve(image);
                    });
                });
        });

        let { language, t, i18n } = this.props;
        let langToUse = language ? language : i18n.language;

        Promise.all([cardBack, maverick, legacy, Common, Uncommon, Rare, Special, qrCode])
            .then(([cardBack, maverick, legacy, Common, Uncommon, Rare, Special, qrCode]) => {
                const Rarities = {Common, Uncommon, Rare, Special};
                ctx.drawImage(cardBack, 0, 0);
                ctx.drawImage(qrCode, 332, 612, 150, 150);

                const houseProm = this.props.houses.map((house, index) => {
                    return new Promise(async res1 => {
                        const img = await loadImage(`img/idbacks/decklist_houses/${ house }.png`);
                        ctx.drawImage(img, houseData[index].x, houseData[index].y, houseData.size, houseData.size);
                        ctx.fillStyle = 'black';
                        ctx.font = 'bold 25px TeutonNormal';
                        ctx.textAlign = 'left';
                        ctx.fillText(t(house).toUpperCase(), houseData[index].x + 40, houseData[index].y + 28);
                        res1();
                    });

                });
                let order = ['action', 'artifact', 'creature', 'upgrade'];
                let cardList = this.props.deckCards.map(card => {
                    return {
                        ...this.props.cards[card.id],
                        is_maverick: !!card.maverick,
                        is_legacy: !!card.legacy,
                        house: card.printedHouse
                    };
                })
                    .sort((a, b) => +a.number - +b.number)
                    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
                    .sort((a, b) => this.props.houses.indexOf(a.house) - this.props.houses.indexOf(b.house));
                const cardProm = cardList.map((card, index) => {
                    return new Promise(async res2 => {


                        const title = (card.locale && card.locale[langToUse]) ? card.locale[langToUse].name : card.name;
                        let x = cardData.start.x,
                            y = cardData.start.y + (index * 28);
                        if(index > 11) {
                            y = y + 45;
                        }
                        if(index > 20) {
                            x = x + 245;
                            y = cardData.start.y + ((index - 22.5) * 28);
                        }
                        if(index > 23) {
                            y = y + 52;
                        }
                        ctx.drawImage((Rarities[card.rarity === 'FIXED' || card.rarity === 'Variant' ? 'Special' : card.rarity]), x, y - 19, cardData.size, cardData.size);
                        ctx.fillStyle = 'black';
                        ctx.font = 'bold 20px TeutonNormal';
                        ctx.textAlign = 'left';
                        ctx.fillText(card.number, x + 22, y);
                        ctx.font = '20px TeutonNormal';
                        ctx.fillText(title, x + 60, y);
                        if(card.is_maverick) {
                            ctx.drawImage(maverick, x + ((title.length * 6) + 100), y - 18, cardData.size, cardData.size);
                        }
                        if(card.is_legacy) {
                            ctx.drawImage(legacy, x + ((title.length * 6) + 100) + (card.is_maverick ? 20 : 0), y - 18, cardData.size, cardData.size);
                        }
                        res2();
                    });
                });
                ctx.drawImage((this.getCircularText(this.props.deckName, 2000, 0)), -700, 30);
                Promise.all([...houseProm, ...cardProm]).then(() => {
                    this.setState({imageUrl: canvas.toDataURL()});
                });
            });
    }

    buildArchon() {
        const houseNames = [{x: 120, y: 750}, {x: 300, y: 800}, {x: 480, y: 750}];
        const canvas = createCanvas(600, 840);
        const ctx = canvas.getContext('2d');
        const cardBack = loadImage(`/img/idbacks/archons/archon_${ Math.floor(Math.random() * 7) + 1 }.png`);
        const house1 = loadImage(`/img/idbacks/archon_houses/${ this.props.houses[0] }.png`);
        const house2 = loadImage(`/img/idbacks/archon_houses/${ this.props.houses[1] }.png`);
        const house3 = loadImage(`/img/idbacks/archon_houses/${ this.props.houses[2] }.png`);
        Promise.all([cardBack, house1, house2, house3]).then(([cardBack, house1, house2, house3]) => {
            ctx.drawImage(cardBack, 0, 0);
            ctx.drawImage(house1, 45, 590, 150, 150);
            ctx.drawImage(house2, 225, 640, 150, 150);
            ctx.drawImage(house3, 405, 590, 150, 150);
            ctx.drawImage((this.getCircularText(this.props.deckName, 700, 0)), -50, 60);
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'grey';
            ctx.textAlign = 'center';
            ctx.font = '30px TeutonNormal';
            this.props.houses.forEach((house, index) => {
                ctx.fillText(house.toUpperCase(), houseNames[index].x, houseNames[index].y);
                ctx.strokeText(house.toUpperCase(), houseNames[index].x, houseNames[index].y);
            });
            this.setState({imageUrl: canvas.toDataURL()});
        });
    }

    getCurvedFontSize(length) {
        const size = (30 / length) * 30;
        if(size > 30) {
            return 40;
        }
        return size;
    }

    getCircularText(text = '', diameter, kerning) {
        let canvas = createCanvas(600, 840);
        let ctx = canvas.getContext('2d');
        let textHeight = 40, startAngle = 0;

        canvas.width = diameter;
        canvas.height = diameter;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'grey';
        ctx.font = `bold ${ this.getCurvedFontSize(text.length) }px TeutonNormal`;

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
    }

    onMouseOver() {
        if(this.props.onMouseOver) {
            this.props.onMouseOver({decklist: true, imageUrl: this.state.imageUrl});
        }
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    render() {
        let className = classNames('panel', 'card-pile', this.props.className, {
            [this.props.size]: this.props.size !== 'normal',
            'vertical': true
        });

        return (
            <div className={ className } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }>
                <div className='card-wrapper'>
                    <div className='card-frame'>
                        <img className={ `card-image vertical ${ this.props.size }` } src={ this.state.imageUrl }/>
                    </div>
                </div>
            </div>
        );
    }
}

IdentityCard.displayName = 'IdentityCard';
IdentityCard.propTypes = {
    card: PropTypes.object,
    cards: PropTypes.object,
    className: PropTypes.string,
    deckCards: PropTypes.array,
    deckName: PropTypes.string,
    deckUuid: PropTypes.string,
    houses: PropTypes.array,
    i18n: PropTypes.object,
    language: PropTypes.string,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    size: PropTypes.string,
    t: PropTypes.func
};

export default withTranslation()(IdentityCard);
