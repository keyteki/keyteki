const Card = require('../../Card.js');

class HorsemanOfWar extends Card {
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
