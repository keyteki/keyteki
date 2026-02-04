const Card = require('../../Card.js');

class ExterminateExterminate extends Card {
    // Play: For each friendly Mars creature you control, destroy a non-Mars creature with lower power.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy a non-Mars creature for each Mars creature they control',
            gameAction: ability.actions.sequentialPairedChoices({
                pairMessage: '{0} uses {1} to choose {2} and destroy {3}',
                sourceCardType: 'creature',
                sourceCondition: (card) => card.hasHouse('mars'),
                sourceController: 'self',
                sourcePromptTitle: 'Choose a friendly Mars creature',
                targetAction: (targets) => ability.actions.destroy({ target: targets }),
                targetCardType: 'creature',
                targetCondition: (card, sourceCard) =>
                    !card.hasHouse('mars') && card.power < sourceCard.power,
                targetController: 'any',
                targetPromptTitle: (sourceCard) =>
                    `Choose a non-Mars creature with less than ${sourceCard.power} power to destroy`
            })
        });
    }
}

ExterminateExterminate.id = 'exterminate-exterminate';

module.exports = ExterminateExterminate;
