const _ = require('underscore');

const Card = require('../../Card.js');

class Fidgit extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: context => !!context.player.opponent,
            target: {
                mode: 'select',
                choices: {
                    'Top of deck': [
                        ability.actions.discard(context => ({
                            location: 'deck',
                            chatMessage: true,
                            target: context.player.opponent.deck[0]
                        }))
                    ],
                    'Random card from archives': [
                        ability.actions.discard(context => ({ target: _.shuffle(context.player.opponent.archives)[0] }))
                    ]
                }
            },
            then: {
                gameAction: ability.actions.playCard(context => ({
                    target: context.player.opponent.discard[0].type === 'action' ? context.player.opponent.discard[0] : []
                }))
            }
        });
    }
}

Fidgit.id = 'fidgit';

module.exports = Fidgit;
