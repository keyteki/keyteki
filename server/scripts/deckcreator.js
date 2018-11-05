const monk = require('monk');

//const CardService = require('../services/CardService.js');
const DeckService = require('../services/DeckService.js');

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

/*
    'Cartographer Ananta Sodtima/Dis Logos Brobnar 001 012 016 016 018 030 032 032 033 044 046 049 054 058 062 068 073 077 083 092 099 101 105 106 106 107 108 110 114 115 117 129 138 143 144 147 147'
    'Gregg, the Adjutant of Myths/Untamed Brobnar Logos 007 012 013 016 016 024 026 030 033 033 035 049 109 109 109 115 117 117 124 142 144 144 145 219 319 323 323 324 351 352 358 363 363 364 365 367 logos',
    'Evellin O. Knottikeni, the Fifth/Shadows Dis Mars 059 067 075 083 084 092 092 092 095 098 102 106 161 161 173 178 180 187 187 189 199 199 203 207 275 279 296 301 307 311 311 311 314 314 314 315',
    'Tarantelli, Rotlane\'s Villain/Mars Untamed Dis 057 059 059 067 072 075 081 085 098 099 100 101 171 172 177 177 178 180 191 192 193 195 201 202 319 330 330 333 333 349 358 361 362 363 363 364'
    'Voltpixel, Underground Boss/Brobnar Logos Dis 010 012 016 020 027 030 032 036 039 046 049 051 055 059 059 067 067 077 077 077 085 095 097 102 109 125 125 129 133 136 139 142 142 143 144 147',
    'Falstaff "Snap" Iarvia/Untamed Sanctum Mars 160 163 172 173 177 186 187 192 193 199 200 205 213 219 220 227 230 236 237 240 257 258 259 265 323 327 330 332 333 333 337 350 361 363 368 370'
    'Xylostopper, the "Conductor" of Fashion/Logos Shadows Dis 053 054 054 059 067 067 069 085 085 101 102 105 114 114 114 117 125 140 142 145 145 149 151 157 267 271 271 290 291 292 301 305 310 314 314 315',
    'He that Blindly Faces The Club/Mars Brobnar Dis 001 001 010 016 029 031 032 039 044 048 049 050 055 056 073 075 077 078 082 083 092 092 095 102 172 173 175 178 182 186 192 196 196 203 204 206',
    'The Peg-Headed Poisoner of Lacmark/Brobnar Untamed Shadows 007 014 016 016 022 029 029 030 032 033 040 040 276 278 288 292 292 302 305 310 311 314 314 318 321 322 323 330 332 341 350 350 351 363 367 368',
    'The Countess of Windhedge/Shadows Logos Brobnar 010 016 018 022 027 029 030 032 035 039 041 050 109 114 115 124 125 125 138 138 139 142 146 158 281 283 290 298 299 303 308 310 310 311 315 315',
    'Radiant Argus the Supreme/Logos Sanctum Untamed 108 115 124 125 125 129 136 136 139 140 144 145 215 215 225 227 233 239 251 255 255 258 259 265 319 323 327 332 351 358 358 363 363 364 367 368'
    'Miss "Onyx" Censorius/Brobnar Dis Shadows 001 010 012 018 022 029 033 033 035 035 046 050 058 062 067 067 073 081 083 083 096 098 101 102 276 276 280 283 290 296 306 308 310 311 315 315',
    'Guide Achea/Brobnar Dis Logos 004 008 008 010 029 032 035 035 035 045 046 049 059 060 061 075 083 096 096 098 099 099 099 101 109 114 115 116 125 136 138 138 140 142 147 151',
    'Paincon, the "Critic" of Gravity/Dis Logos Sanctum 056 063 064 075 092 098 098 098 099 100 101 102 107 111 117 117 127 137 138 139 142 142 153 154 217 228 243 246 246 247 247 248 248 249 249 255',
    'Erabelle A. Leudimple, the Fractional/Dis Shadows Logos 054 058 059 062 074 081 083 092 096 099 099 101 109 117 121 125 133 138 138 140 142 142 151 159 267 269 270 280 281 290 294 296 305 307 307 315'
    'Powerscoot, the Charlatan Scientist/Logos Untamed Shadows 107 118 124 133 135 137 140 140 142 147 150 157 270 270 276 276 276 279 280 281 283 288 296 305 319 322 323 326 350 362 363 363 363 363 364 364',
    'Excelaeon of the Inventor\'s Caverns/Logos Sanctum Mars 108 118 123 124 129 139 145 145 147 154 146 147 160 163 174 174 177 186 187 193 199 204 207 208 215 215 220 220 224 230 230 233 236 242 244 258'
*/

let decks = [];
let deckdata = [
    'Khyrmn, Hierophant of the Nihilistic Haunt/Untamed Dis Shadows 059 060 068 068 077 083 086 087 092 092 096 099 267 268 269 281 281 290 296 305 306 308 310 316 329 331 332 338 338 351 358 363 367 368 369 369',
    'Berger, the Caller of Beejungle/Untamed Shadows Mars 173 193 195 196 199 200 200 202 205 205 205 209 267 270 274 289 290 290 296 301 305 306 308 314 319 319 323 328 333 333 350 355 358 358 363 367',
    'Vlaad, Firemoon Keep\'s Whale/Untamed Logos Mars 109 114 117 125 134 136 138 139 140 142 142 148 162 169 187 196 196 199 199 199 203 205 205 205 319 323 323 330 333 333 351 352 356 361 368 368',
    'Iridaral Amethyst-Feldt, Despot/Sanctum Dis Brobnar 002 007 010 012 016 021 025 032 033 033 039 040 055 055 057 058 059 062 077 079 095 102 102 217 217 217 217 220 228 238 241 241 255 256 261',
    'Enveldson the Proportionate/Untamed Brobnar Sanctum 005 007 017 021 026 026 031 035 042 046 046 217 226 234 237 238 239 241 241 241 243 258 258 322 323 323 323 325 327 344 345 355 361 361 367',
    'Machiao, the Heretic of Daggers/Dis Logos Brobnar 001 012 013 016 016 030 033 033 035 038 048 049 058 059 062 065 066 073 073 073 081 087 099 100 110 110 116 119 124 125 136 138 138 140 152 154',
    'Ms. Purebrow, the Fizzy Turncoat/Sanctum Logos Untamed 108 108 114 118 120 125 129 138 139 144 150 154 212 215 220 224 227 239 239 253 254 254 255 262 319 319 322 323 333 333 349 351 351 367 368 370',
    '"Baron" Malachi, Complex Spy/Logos Dis Sanctum 054 059 066 073 073 083 092 092 094 099 101 106 110 112 121 122 129 135 138 139 145 147 147 157 226 227 228 231 233 233 237 238 241 244 252 254'
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
        console.log(num);
        let cardData = rawData.CardData.find(card => parseInt(card.number) === parseInt(num));
        if(!deck.houses.includes(cardData.house)) {
            console.log('no matching house', cardData.id)
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
/*
let db = monk('mongodb://127.0.0.1:27017/keyforge');
let deckService = new DeckService(db);

Promise.all(decks.map(deck => deckService.create(deck)))
    .then(results => {
        console.log(results);
        db.close();
    })
    .catch(() => db.close());
*/