const Card = require('../../Card.js');

class BorrNitsTouch extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                activePromptTitle: 'Which player\'s deck',
                choices: {
                    Mine: () => true,
                    'My opponent\'s': context => !!context.player.opponent
                }
            },
            gameAction: ability.actions.reveal(context => ({
                location: 'deck',
                target: (!context.select || context.select === 'Mine') ? context.player.deck.slice(0, 5) : context.player.opponent.deck.slice(0, 5)
            })),
            then: preThenContext => ({
                gameAction: ability.actions.purge({
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose which card to purge',
                        cards: (!preThenContext.select || preThenContext.select === 'Mine') ? preThenContext.player.deck.slice(0, 5) : preThenContext.player.opponent.deck.slice(0, 5),
                        message: '{0} chooses to purge {2}'
                    }
                })
            })
        });
    }
}

BorrNitsTouch.id = 'borrs-nits-touch';

module.exports = BorrNitsTouch;
