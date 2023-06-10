const Card = require('../../Card.js');

class SagittariisGaze extends Card {
    // Enhance D. (These icons have already been added to cards in your deck.)
    // Play: Exalt a damaged creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasToken('damage'),
                gameAction: ability.actions.exalt()
            }
        });
    }
}

SagittariisGaze.id = 'sagittarii-s-gaze';

module.exports = SagittariisGaze;
