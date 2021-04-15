const Card = require('../../Card.js');

class AvengingAura extends Card {
    // For the remainder of the turn, each friendly creature gains assault X, where X is the number of forged keys your opponent has.
    setupCardAbilities(ability) {
        this.play({
            effect: 'All friendly creature ',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                target: context.player.creaturesInPlay,
                effect: ability.effects.addKeyword({
                    assault: context.player.opponent ? context.player.opponent.getForgedKeys() : 0
                })
            }))
        });
    }
}

AvengingAura.id = 'avenging-aura';

module.exports = AvengingAura;
