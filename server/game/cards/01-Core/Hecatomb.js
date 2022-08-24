const Card = require('../../Card.js');

class Hecatomb extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                'destroy each Dis creature (including {1}). Each player gains 1 amber for each creature they controlled that was destroyed this way.',
            effectArgs: (context) => {
                const creatures = getDisCreatures(context);
                return [creatures.length > 0 ? creatures : 'nothing'];
            },
            gameAction: ability.actions.destroy((context) => ({
                target: getDisCreatures(context)
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvents.filter(
                            (event) => !event.cancelled && event.clone.controller == context.player
                        ).length
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.clone.controller == context.player.opponent
                        ).length
                    }))
                ]
            }
        });
    }
}

function getDisCreatures(context) {
    return context.game.creaturesInPlay.filter((card) => card.hasHouse('dis'));
}

Hecatomb.id = 'hecatomb';

module.exports = Hecatomb;
