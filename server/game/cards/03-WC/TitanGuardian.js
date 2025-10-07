import Card from '../../Card.js';

class TitanGuardian extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Destroyed: If Titan Guardian is not on a flank, draw 2 cards.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => !context.source.isOnFlank(),
            effect: 'draw 2 cards',
            gameAction: ability.actions.draw({
                amount: 2
            })
        });
    }
}

TitanGuardian.id = 'titan-guardian';

export default TitanGuardian;
