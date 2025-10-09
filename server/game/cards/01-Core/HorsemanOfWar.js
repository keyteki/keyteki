const Card = require('../../Card.js');

class HorsemanOfWar extends Card {
    // Play: For the remainder of the turn, each friendly creature can be used as if they were in the active house, but can only fight.
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow all friendly creatures to only fight this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: [
                    ability.effects.canUse((card) => card.type === 'creature'),
                    ability.effects.cardCannot(
                        'useAction',
                        (context) =>
                            context.source.type === 'creature' &&
                            context.ability.title !== 'Fight with this creature'
                    ),
                    ability.effects.cardCannot('reap')
                ]
            })
        });
    }
}

HorsemanOfWar.id = 'horseman-of-war';

module.exports = HorsemanOfWar;
