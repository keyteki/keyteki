const Card = require('../../Card.js');

class SigilOfBrotherhood extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canUse(card => card.printedFaction === 'sanctum')
            })
        });
    }
}

SigilOfBrotherhood.id = 'sigil-of-brotherhood'; // This is a guess at what the id might be - please check it!!!

module.exports = SigilOfBrotherhood;
