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

/*
    'Oneve Hava, The Lying and Havenesque	Shadows	Mars	Dis	054	058	058	067	067	069	070	075	083	094	101	102	161	169	172	173	174	177	177	187	195	196	199	204	267	270	270	275	276	281	282	282	283	291	305	310',
    'Sahl the Aegian	Shadows	Untamed	Sanctum	213	215	215	215	219	226	227	239	241	251	265	265	271	280	281	288	296	303	304	306	306	310	314	316	319	323	330	330	333	345	358	367	367	367	368	369',
    'Titanfang, Tower Fighter	Shadows	Brobnar	Dis	007	010	010	018	022	024	029	029	032	046	046	049	062	067	075	083	083	084	088	095	098	098	100	101	270	270	276	276	279	281	285	296	308	311	314	317',
    'W. Tioj, Spellview\'s Anxious Mentor	Mars	Logos	Untamed	110	115	116	117	124	129	140	144	145	151	154	155	163	169	169	174	177	187	192	196	200	204	204	207	323	325	327	330	332	346	347	349	358	361	367	368'
    'Lucretia, Priest of the Authentic State	Sanctum	Shadows	Brobnar	001	001	001	002	010	012	014	016	027	039	039	049	215	218	220	233	236	237	240	240	254	255	256	257	277	279	281	293	293	296	296	298	305	306	315	318'
    'T. Neratius, Stargard\'s Clean Cooper	Sanctum	Logos	Mars	110	111	114	117	118	120	120	125	129	138	147	153	163	163	168	172	173	178	187	193	195	205	208	211	217	225	233	238	239	244	245	245	254	255	260	264',
    'Benegoblin, the "Alien" of Knowledge	Logos	Mars	Untamed	112	114	115	116	123	129	137	139	140	144	156	157	160	178	178	182	185	190	195	200	200	203	205	210	319	326	339	340	341	345	345	349	350	363	366	367',
    'Birrit "Provost Jeeves" Aguda	Dis	Sanctum	Brobnar	001	005	015	017	018	025	033	036	039	049	051	052	055	058	067	067	067	073	075	083	085	099	102	106	216	226	228	230	234	239	252	258	258	259	259	260'
*/

let decks = [];
let deckdata = [
    'Cartographer Ananta Sodtima/Dis Logos Brobnar 001 012 016 016 018 030 032 032 033 044 046 049 054 058 062 068 073 077 083 092 099 101 105 106 106 107 108 110 114 115 117 129 138 143 144 147 147'
];

for(let data of deckdata) {
    let nameSplit = data.split('/');
    let deck = { username: 'public', banned: false };
    deck.name = nameSplit[0];
    deck.identity = deck.name.toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
    deck.cardback = deck.identity + '_back';
    let split = nameSplit[1].split(' ');
    deck.houses = split.slice(0, 3).map(house => house.toLowerCase());
    deck.cards = [];
    let mavCounter = 0;
    for(let num of split.slice(3, 39)) {
        let cardData = rawData.CardData.find(card => parseInt(card.number) === parseInt(num));
        if(!deck.houses.includes(cardData.house)) {
            deck.cards.push({ id: cardData.id, count: 1, maverick: split[39 + mavCounter] });
            mavCounter++;
        } else if(!cardData) {
            throw new Error('Can\'t find data for ' + num);
        } else {
            let card = deck.cards.find(card => card.id === cardData.id);
            if(card) {
                card.count += 1;
            } else {
                deck.cards.push({ id: cardData.id, count: 1 });
            }
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
