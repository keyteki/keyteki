const Card = require('../../Card.js');

class T3r35a extends Card {
    // T3R-35A may be used as if it belonged to either of its neighbor's houses.
    // T3R-35A may be played as an upgrade instead of a creature, with the text: “This creature may be used as if it belonged to either of its neighbor's houses.”
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

        // give the creature this card is attached to this effect
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
