import Card from '../../Card.js';

class StentersFormula extends Card {
    // Play: Ward up to 3 creatures. Draw a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.ward()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            }
        });
    }
}

StentersFormula.id = 'stenter-s-formula';

export default StentersFormula;
