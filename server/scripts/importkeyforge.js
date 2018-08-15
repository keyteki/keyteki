/*eslint no-console:0 */
const monk = require('monk');

const CardService = require('../services/CardService.js');
const DeckService = require('../services/DeckService.js');

let db = monk('mongodb://127.0.0.1:27017/keyforge');
let cardService = new CardService(db);
let deckService = new DeckService(db);

let rawData = require('./keyforge.json');
for(const card of rawData.CardData.filter(card => card.name !== '')) {
    card.id = card.name.toLowerCase().replace(/"\?.!/gi, '').replace(/[ ']/gi, '-');
    card.type = card.type.toLowerCase();
    card.house = card.house.toLowerCase();
    card.amber = card.amber === '' ? 0 : parseInt(card.amber);
    card.power = card.power === '' ? null : parseInt(card.power);
    card.armor = card.type === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null;
    card.traits = card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase());
    card.keywords = card.keywords === '' ? [] : card.keywords.split(', ').map(keyword => keyword.toLowerCase());
}
let fetchCards = cardService.replaceCards(rawData.CardData);
//let createDeck = deckService.findByUserName('public');

let createDecks = [];
/*
createDecks.push(deckService.create({
    username: 'public',
    name: 'Arria, Moonhurst Monk',
    houses: ['logos', 'sanctum', 'untamed'],
    cards: [
        { id: 'foggify', count: 1 },
        { id: 'labwork', count: 2 },
        { id: 'library-access', count: 1 },
        { id: 'neuro-syphon', count: 1 },
        { id: 'remote-access', count: 1 },
        { id: 'batdrone', count: 2 },
        { id: 'dextre', count: 1 },
        { id: 'dr-escotera', count: 1 },
        { id: 'ganymede-archivist', count: 1 },
        { id: 'titan-mechanic', count: 1 },
        { id: 'begone', count: 1 },
        { id: 'shield-of-justice', count: 1 },
        { id: 'take-hostages', count: 1 },
        { id: 'virtuous-works', count: 1 },
        { id: 'potion-of-invulnerability', count: 2 },
        { id: 'sigil-of-brotherhood', count: 1 },
        { id: 'bulwark', count: 1 },
        { id: 'champion-anaphiel', count: 1 },
        { id: 'francus', count: 1 },
        { id: 'sargeant-zakiel', count: 1 },
        { id: 'staunch-knight', count: 1 },
        { id: 'save-the-pack', count: 1 },
        { id: 'ancient-bear', count: 2 },
        { id: 'dust-pixie', count: 1 },
        { id: 'flaxia', count: 1 },
        { id: 'inka-the-spider', count: 1 },
        { id: 'snufflegator', count: 2 },
        { id: 'mighty-tiger', count: 1 },
        { id: 'mushroom-man', count: 2 },
        { id: 'witch-of-the-eye', count: 1 }
    ]
}));*/
createDecks.push(deckService.create({
    username: 'public',
    name: 'Flaregas, Spawn of Conflascoot',
    houses: ['dis', 'shadows', 'untamed'],
    cards: [
        { id: 'arise', count: 1 },
        { id: 'gateway-to-dis', count: 1 },
        { id: 'poltergeist', count: 1 },
        { id: 'dominator-bauble', count: 1 },
        { id: 'key-to-dis', count: 1 },
        { id: 'eater-of-the-dead', count: 1 },
        { id: 'pit-demon', count: 3 },
        { id: 'shooler', count: 1 },
        { id: 'succubus', count: 1 },
        { id: 'the-terror', count: 1 },
        { id: 'bait-and-switch', count: 1 },
        { id: 'key-of-darkness', count: 1 },
        { id: 'nerve-blast', count: 1 },
        { id: 'pawn-sacrifice', count: 1 },
        { id: 'poison-wave', count: 1 },
        { id: 'magda-the-rat', count: 1 },
        { id: 'noddy-the-thief', count: 1 },
        { id: 'shadow-self', count: 1 },
        { id: 'silvertooth', count: 1 },
        { id: 'urchin', count: 2 },
        { id: 'silent-dagger', count: 1 },
        { id: 'fogbank', count: 1 },
        { id: 'grasping vines', count: 1 },
        { id: 'lost-in-the-woods', count: 3 },
        { id: 'regrowth', count: 2 },
        { id: 'niffle-ape', count: 2 },
        { id: 'snufflegator', count: 1 },
        { id: 'niffle-queen', count: 1 },
        { id: 'hunting-witch', count: 1 }
    ]
}));
createDecks.push(deckService.create({
    username: 'public',
    name: 'Pinance Mobis-Ortiz, Countess',
    houses: ['dis', 'sanctum', 'untamed'],
    cards: [
        { id: 'arise', count: 1 },
        { id: 'control-the-weak', count: 1 },
        { id: 'hand-of-dis', count: 1 },
        { id: 'mind-barb', count: 1 },
        { id: 'three-fates', count: 1 },
        { id: 'lash-of-broken-dreams', count: 1 },
        { id: 'ember-imp', count: 1 },
        { id: 'pit-demon', count: 1 },
        { id: 'pitlord', count: 2 },
        { id: 'shooler', count: 1 },
        { id: 'succubus', count: 1 },
        { id: 'shield-of-justice', count: 1 },
        { id: 'blinding-light', count: 2 },
        { id: 'charge', count: 1 },
        { id: 'protectrix', count: 3 },
        { id: 'sigil-of-brotherhood', count: 1 },
        { id: 'bulwark', count: 1 },
        { id: 'francus', count: 1 },
        { id: 'staunch-knight', count: 1 },
        { id: 'shoulder-armor', count: 1 },
        { id: 'key-charge', count: 1 },
        { id: 'lost-in-the-woods', count: 1 },
        { id: 'ancient-bear', count: 1 },
        { id: 'regrowth', count: 2 },
        { id: 'word-of-returning', count: 1 },
        { id: 'hunting-witch', count: 1 },
        { id: 'murmook', count: 2 },
        { id: 'way-of-the-bear', count: 1 },
        { id: 'witch-of-the-eye', count: 2 }
    ]
}));
createDecks.push(deckService.create({
    username: 'public',
    name: 'The Pampered Virtuoso Baron of Caringhall',
    houses: ['dis', 'logos', 'shadows'],
    cards: [
        { id: 'arise', count: 2 },
        { id: 'control-the-weak', count: 1 },
        { id: 'gateway-to-dis', count: 1 },
        { id: 'guilty-hearts', count: 1 },
        { id: 'annihilation-ritual', count: 1 },
        { id: 'domination-bauble', count: 1 },
        { id: 'lash-of-broken-dreams', count: 1 },
        { id: 'charette', count: 1 },
        { id: 'ember-imp', count: 1 },
        { id: 'guardian-demon', count: 1 },
        { id: 'tocsin', count: 1 },
        { id: 'interdimensional-graft', count: 1 },
        { id: 'labwork', count: 1 },
        { id: 'library-access', count: 1 },
        { id: 'phase-shift', count: 1 },
        { id: 'wild-wormhole', count: 1 },
        { id: 'anomaly-exploiter', count: 1 },
        { id: 'batdrone', count: 1 },
        { id: 'dr-escotera', count: 1 },
        { id: 'ganymede-archivist', count: 1 },
        { id: 'mother', count: 1 },
        { id: 'research smoko', count: 1 },
        { id: 'experimental-therapy', count: 1 },
        { id: 'bait-and-switch', count: 1 },
        { id: 'poison-wave', count: 1 },
        { id: 'relentless-whispers', count: 1 },
        { id: 'seeker-needle', count: 1 },
        { id: 'the-sting', count: 1 },
        { id: 'nexus', count: 1 },
        { id: 'noddy-the-thief', count: 2 },
        { id: 'shadow-self', count: 1 },
        { id: 'urchin', count: 1 },
        { id: 'duskrunner', count: 1 },
        { id: 'silvertooth', count: 1 }
    ]
}));
createDecks.push(deckService.create({
    username: 'public',
    name: 'Guru Catbee, the Inventive Baron',
    houses: ['dis', 'logos', 'sanctum'],
    cards: [
        { id: 'arise', count: 1 },
        { id: 'gateway-to-dis', count: 1 },
        { id: 'gongoozle', count: 1 },
        { id: 'hysteria', count: 1 },
        { id: 'domination-bauble', count: 1 },
        { id: 'lash-of-broken-dreams', count: 1 },
        { id: 'ember-imp', count: 2 },
        { id: 'gabos-longarms', count: 1 },
        { id: 'shaffles', count: 1 },
        { id: 'succubus', count: 1 },
        { id: 'the-terror', count: 1 },
        { id: 'flame-wreathed', count: 1 },
        { id: 'labwork', count: 2 },
        { id: 'neuro-syphon', count: 1 },
        { id: 'twin-bolt-emission', count: 1 },
        { id: 'wild-wormhole', count: 1 },
        { id: 'doc-bookton', count: 1 },
        { id: 'ganymede-archivist', count: 1 },
        { id: 'quixo-the-adventurer', count: 1 },
        { id: 'mother', count: 1 },
        { id: 'titan-mechanic', count: 2 },
        { id: 'blinding-light', count: 1 },
        { id: 'shield-of-justice', count: 1 },
        { id: 'take-hostages', count: 2 },
        { id: 'terms-of-redress', count: 1 },
        { id: 'bulwark', count: 1 },
        { id: 'champion-tabris', count: 1 },
        { id: 'grey-monk', count: 1 },
        { id: 'raiding-knight', count: 1 },
        { id: 'sequis', count: 2 },
        { id: 'the-vaultkeeper', count: 1 }
    ]
}));
Promise.all(createDecks)
    .then(results => {
        console.log(results);
        db.close();
    })
    .catch(() => db.close());
