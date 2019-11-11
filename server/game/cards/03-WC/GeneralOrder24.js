const Card = require('../../Card.js');

class GeneralOrder24 extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseStarted: event => event.phase === 'key'
            },
            gameAction: ability.actions.destroy(context => ({ target: context.game.activePlayer.creaturesInPlay.length === 0 ? context.source : [] })),
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                cardCondition: (card, context) => context.game.activePlayer.creaturesInPlay.includes(card),
                gameAction: ability.actions.destroy(context => ({
                    target: context.target && context.game.creaturesInPlay.filter(creature => context.target.getHouses().some(house => creature.hasHouse(house)))
                }))
            }
        });
    }
}

GeneralOrder24.id = 'general-order-24';

module.exports = GeneralOrder24;
