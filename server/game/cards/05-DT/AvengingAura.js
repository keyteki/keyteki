const Card = require('../../Card.js');

class AvengingAura extends Card {
    //Play: Each friendly creature gains Assault X for the rest of this turn, where X is the number of keys your opponent has forged.
    setupCardAbilities(ability) {
        this.play({
            effect: 'All friendly creature ',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                target: context.player.creaturesInPlay,
                effect: ability.effects.addKeyword({
                    assault: context.player.opponent
                        ? 3 - context.player.opponent.getForgedKeys()
                        : 0
                })
            }))
        });
    }
}

AvengingAura.id = 'avenging-aura';

module.exports = AvengingAura;
