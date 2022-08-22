const Card = require('../../Card.js');

class Hecatomb extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                'destroy all dis creatures and each player gains amber equal to the number of their creatures destroyed',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse('dis'))
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled && event.card.owner.uuid == context.player.uuid
                        ).length
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.card.owner.uuid == context.player.opponent.uuid
                        ).length
                    }))
                ]
            }
        });
    }
}

Hecatomb.id = 'hecatomb';

module.exports = Hecatomb;
