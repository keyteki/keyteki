const _ = require('underscore');

const Card = require('../../Card.js');

class Murkens extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'select',
                choices: {
                    'Top of deck': [
                        ability.actions.reveal((context) => ({
                            location: 'deck',
                            chatMessage: true,
                            target: context.player.checkRestrictions(
                                'play',
                                context.game.getFrameworkContext()
                            )
                                ? context.player.opponent.deck[0]
                                : []
                        })),
                        ability.actions.playCard((context) => ({
                            target: context.player.opponent.deck[0]
                        }))
                    ],
                    'Random card from archives': [
                        ability.actions.playCard((context) => ({
                            target: _.shuffle(context.player.opponent.archives)[0]
                        }))
                    ]
                }
            }
        });
    }
}

Murkens.id = 'murkens';

module.exports = Murkens;
