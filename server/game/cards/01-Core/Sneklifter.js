const Card = require('../../Card.js');

class Sneklifter extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}',
            then: (context) => ({
                condition: () =>
                    context.player.houses.every((house) => !context.target.hasHouse(house)),
                gameAction: ability.actions.cardLastingEffect({
                    target: context.target,
                    duration: 'lastingEffect',
                    until: {
                        onTakeControl: (event) =>
                            event.card === context.target &&
                            event.player === context.player.opponent
                    },
                    effect: ability.effects.changeHouse('shadows')
                })
            })
        });
    }
}

Sneklifter.id = 'sneklifter';

module.exports = Sneklifter;
