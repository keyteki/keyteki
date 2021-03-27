const Card = require('../../Card.js');

class SelectivePreservation extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature of each power value to not destroy',
                cardType: 'creature',
                mode: 'exactly',
                numCards: (context) =>
                    new Set(context.game.creaturesInPlay.map((card) => card.power)).size,
                selectorCondition: (selectedCards, context) =>
                    new Set(context.game.creaturesInPlay.map((card) => card.power)).size ===
                    new Set(selectedCards.map((card) => card.power)).size,
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => context.target && !context.target.includes(card)
                    )
                }))
            }
        });
    }
}

SelectivePreservation.id = 'selective-preservation';

module.exports = SelectivePreservation;
