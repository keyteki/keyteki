const _ = require('underscore');

const Card = require('../../Card.js');

class Fidgit extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'select',
                choices: {
                    'Top of deck': [
                        ability.actions.discard((context) => {
                            context.event.discardedCard = null;
                            return {
                                location: 'deck',
                                chatMessage: true,
                                target: context.player.opponent.deck[0]
                            };
                        })
                    ],
                    'Random card from archives': [
                        ability.actions.discard((context) => {
                            context.event.discardedCard = _.shuffle(
                                context.player.opponent.archives
                            )[0];
                            return {
                                target: context.event.discardedCard
                            };
                        })
                    ]
                }
            },
            then: (preThenContext) => {
                return {
                    gameAction: ability.actions.playCard((context) => ({
                        target:
                            (preThenContext.event.discardedCard !== null &&
                                preThenContext.event.discardedCard.controller !== context.player &&
                                context.player.opponent.discard[0].type === 'action') ||
                            (context.player.opponent.discard[0].type === 'action' &&
                                preThenContext.event.discardedCard === null)
                                ? context.player.opponent.discard[0]
                                : []
                    }))
                };
            }
        });
    }
}

Fidgit.id = 'fidgit';

module.exports = Fidgit;
