const _ = require('underscore');
const Card = require('../../Card.js');

class Keyforgery extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            condition: context => !!context.player.opponent,
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            target: {
                mode: 'house'
            },
            effect: 'force {1} to choose a house and {1} selects house {2}',
            effectArgs: context => [context.player.opponent, context.house],
            gameAction: ability.actions.reveal(context => ({
                location: 'hand',
                chatMessage: true,
                target: _.shuffle(context.player.hand)[0]
            })),
            then: preThenContext => ({
                message: '{0} uses {1} to {3}',
                messageArgs: context => [!context.preThenEvent.card.hasHouse(preThenContext.house) ?
                    'destroy itself and skip the Forge Key step' : 'continue the Forge Key step'],
                gameAction: [
                    ability.actions.destroy(context => ({ target : !context.preThenEvent.card.hasHouse(preThenContext.house) ? context.source : [] })),
                    ability.actions.changeEvent(context => ({
                        event: preThenContext.event,
                        cancel: !context.preThenEvent.card.hasHouse(preThenContext.house)
                    }))
                ]
            })
        });
    }
}

Keyforgery.id = 'keyforgery';

module.exports = Keyforgery;
