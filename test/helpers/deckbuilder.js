const _ = require('underscore');
const monk = require('monk');

const CardService = require('../../server/services/CardService.js');
const {matchCardByNameAndPack} = require('./cardutil.js');

const defaultFaction = 'phoenix';
const defaultRole = 'seeker-of-water';
const defaultStronghold = 'city-of-the-open-hand';
const minProvince = 5;
const provinceFiller = 'shameful-display';
const minDynasty = 8;
const dynastyFiller = 'adept-of-the-waves';
const minConflict = 10;
const conflictFiller = 'supernatural-storm';


class DeckBuilder {
    constructor() {
        this.cards = {};
        this.loaded = false;
        // Filler info which might be used outside the class
        this.fillers = {
            faction: defaultFaction,
            role: defaultRole,
            stronghold: defaultStronghold,
            province: provinceFiller,
            dynasty: dynastyFiller,
            conflict: conflictFiller
        };
        this.loadCards();
    }

    // Lazily loads the cards from the db
    async loadCards() {
        if(!this.load) {
            let db = monk('mongodb://127.0.0.1:27017/ringteki');
            let cardService = new CardService(db);
            this.load = cardService.getAllCards()
                .then((cards) => {
                    this.cards = {};
                    _.each(cards, card => {
                        this.cards[card.id] = card;
                    });
                    this.loaded = true;
                })
                .then(() => db.close())
                .catch(() => db.close());
        }
        return this.load;
    }

    /*
        options: as player1 and player2 are described in setupTest #1514
    */
    async customDeck(player = {}) {
        let faction = defaultFaction;
        let role = defaultRole;
        let stronghold = defaultStronghold;
        let provinceDeck = [];
        let conflictDeck = [];
        let dynastyDeck = [];
        let inPlayCards = []; // Considered separately, because may consist of both dynasty and conflict
        if(player.faction) {
            faction = player.faction;
        }
        if(player.role) {
            role = player.role;
        }
        if(player.stronghold) {
            stronghold = player.stronghold;
        }
        //Create the province deck
        if(player.strongholdProvince) {
            provinceDeck.push(player.strongholdProvince);
        }
        if(player.provinces) {
            _.each(player.provinces, province => {
                if(province.provinceCard) {
                    provinceDeck.push(province.provinceCard);
                }
            });
        }
        //Fill the deck up to minimum number of provinces
        while(provinceDeck.length < minProvince) {
            provinceDeck.push(provinceFiller);
        }
        /*
         * Create the dynasty deck - dynasty deck consists of cards in decks,
         * provinces and discard
         */
        if(player.dynastyDeck) {
            dynastyDeck.push(...player.dynastyDeck);
        }
        if(player.dynastyDiscard) {
            dynastyDeck.push(...player.dynastyDiscard);
        }
        _.each(player.provinces, province => {
            if(province.dynastyCards) {
                dynastyDeck.push(...province.dynastyCards);
            }
        });
        //Fill the deck up to minimum
        while(dynastyDeck.length < minDynasty) {
            dynastyDeck.push(dynastyFiller);
        }
        /**
         * Create the conflict deck - conflict deck consists of cards in decks,
         * hand and discard
         */
        if(player.conflictDeck) {
            conflictDeck.push(...player.conflictDeck);
        }
        if(player.conflictDiscard) {
            conflictDeck.push(...player.conflictDiscard);
        }
        if(player.hand) {
            conflictDeck.push(...player.hand);
        }
        //Fill the deck up to minimum
        while(conflictDeck.length < minConflict) {
            conflictDeck.push(conflictFiller);
        }

        //Collect the names of cards in play
        _.each(player.inPlay, card => {
            if(_.isString(card)) {
                inPlayCards.push(card);
            } else {
                //Add the card itself
                inPlayCards.push(card.card);
                //Add any attachments
                if(card.attachments) {
                    inPlayCards.push(...card.attachments);
                }
            }
        });

        //Collect all the cards together
        var deck = provinceDeck.concat(conflictDeck)
            .concat(dynastyDeck).concat(inPlayCards)
            .concat(role).concat(stronghold);

        return this.buildDeck(faction, deck);
    }

    async buildDeck(faction, cardLabels) {
        await this.loadCards();
        var cardCounts = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        return {
            faction: { value: faction },
            stronghold: _.filter(cardCounts, count => count.card.type === 'stronghold'),
            role: _.filter(cardCounts, count => count.card.type === 'role'),
            conflictCards: _.filter(cardCounts, count => count.card.side === 'conflict'),
            dynastyCards: _.filter(cardCounts, count => count.card.side === 'dynasty'),
            provinceCards: _.filter(cardCounts, count => count.card.type === 'province')
        };
    }

    getCard(idOrLabelOrName) {
        if(!this.loaded) {
            throw new Error('Cards have not finished loading from database');
        }
        if(this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(idOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            var matchingLabels = _.map(cardsByName, card => `${card.name} (${card.pack_code})`).join('\n');
            throw new Error(`Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;
