const monk = require('monk');

//const CardService = require('../services/CardService.js');
const DeckService = require('../services/DeckService.js');

let db = monk('mongodb://127.0.0.1:27017/keyforge');
let deckService = new DeckService(db);

let rawData = require('./keyforge.json');
for(const card of rawData.CardData.filter(card => card.name !== '')) {
    card.id = card.name.toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
    card.type = card.type.toLowerCase();
    card.house = card.house.toLowerCase();
    card.amber = card.amber === '' ? 0 : parseInt(card.amber);
    card.power = card.power === '' ? null : parseInt(card.power);
    card.armor = card.type === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null;
    card.traits = card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase());
    card.keywords = card.keywords === '' ? [] : card.keywords.split(', ').map(keyword => keyword.toLowerCase());
}
let decks = [];
let deckdata = [
    'Oneve Hava, The Lying and Havenesque	Shadows	Mars	Dis	054	058	058	067	067	069	070	075	083	094	101	102	161	169	172	173	174	177	177	187	195	196	199	204	267	270	270	275	276	281	282	282	283	291	305	310',
    'Sahl the Aegian	Shadows	Untamed	Sanctum	213	215	215	215	219	226	227	239	241	251	265	265	271	280	281	288	296	303	304	306	306	310	314	316	319	323	330	330	333	345	358	367	367	367	368	369',
    'Titanfang, Tower Fighter	Shadows	Brobnar	Dis	007	010	010	018	022	024	029	029	032	046	046	049	062	067	075	083	083	084	088	095	098	098	100	101	270	270	276	276	279	281	285	296	308	311	314	317',
    'W. Tioj, Spellview\'s Anxious Mentor	Mars	Logos	Untamed	110	115	116	117	124	129	140	144	145	151	154	155	163	169	169	174	177	187	192	196	200	204	204	207	323	325	327	330	332	346	347	349	358	361	367	368'
];

for(let data of deckdata) {
    let split = data.split('	');
    let deck = { username: 'public' };
    deck.name = split[0];
    deck.identity = split[0].toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
    deck.cardback = deck.identity + '_back';
    deck.houses = split.slice(1, 4).map(house => house.toLowerCase());
    deck.cards = [];
    for(let num of split.slice(4)) {
        let cardData = rawData.CardData.find(card => parseInt(card.number) === parseInt(num));
        if(!cardData) {
            throw new Error('Can\'t find data for ' + num);
        }
        let card = deck.cards.find(card => card.id === cardData.id);
        if(card) {
            card.count += 1;
        } else {
            deck.cards.push({ id: cardData.id, count: 1 });
        }
    }
    decks.push(deck);
}

Promise.all(decks.map(deck => deckService.create(deck)))
    .then(results => {
        console.log(results);
        db.close();
    })
    .catch(() => db.close());
