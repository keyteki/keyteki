const Card = require('../../Card.js');

class T3r35a extends Card {
    //This creature can be used as if it belongs to the same house as its neighbor.
    //This creature may be played as an upgrade with the text, "This creature can be used as if it belongs to the same house as its neighbor."
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        // give the card as creature this effect
        this.persistentEffect({
            effect: ability.effects.canUse((card) => {
                let possibleHouses = [];
                if (card.neighbors.length > 0) {
                    possibleHouses = possibleHouses.concat(card.neighbors[0].getHouses());
                }

                if (card.neighbors.length > 1) {
                    possibleHouses = possibleHouses.concat(card.neighbors[1].getHouses());
                }

                return possibleHouses.includes(card.game.activePlayer.activeHouse);
            })
        });

        // give the creature this card is attached to this effect:
        this.whileAttached({
            effect: ability.effects.canUse((card) => {
                let possibleHouses = [];
                if (card.neighbors.length > 0) {
                    possibleHouses = possibleHouses.concat(card.neighbors[0].getHouses());
                }

                if (card.neighbors.length > 1) {
                    possibleHouses = possibleHouses.concat(card.neighbors[1].getHouses());
                }

                return possibleHouses.includes(card.game.activePlayer.activeHouse);
            })
        });
    }
}

T3r35a.id = 't3r-35a';

module.exports = T3r35a;
