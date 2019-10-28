const Card = require('../../Card.js');

class GeneralOrder24 extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseStarted: (event, context) =>  event.phase === 'key' && this.game.activePlayer.creaturesInPlay.length === 0
            },
            gameAction: ability.actions.destroy(context => ({ target: this }))
        });

        this.interrupt({
            when: {
                onPhaseStarted: (event, context) => event.phase === 'key' && this.game.activePlayer.creaturesInPlay.length > 0
            },
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                cardCondition: card => this.game.activePlayer.creaturesInPlay.includes(card),
                gameAction: ability.actions.destroy(context => ({
                    target: context.game.creaturesInPlay.filter(creature => context.target.getHouses().some(house => creature.hasHouse(house)))
                }))
            }
        });
    }
}

GeneralOrder24.id = 'general-order-24';

module.exports = GeneralOrder24;
