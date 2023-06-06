const Card = require('../../Card.js');

class GreyAbess extends Card {
    // Play: Make a token creature. Each friendly token creature gets +1 armor
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        }),
            this.persistentEffect({
                match: (card) => card.type === 'creature' && card.isToken(),
                effect: ability.effects.modifyArmor(1)
            });
    }
}

GreyAbess.id = 'grey-abbess';

module.exports = GreyAbess;
