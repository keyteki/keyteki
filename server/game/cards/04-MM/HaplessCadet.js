import Card from '../../Card.js';

class HaplessCadet extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Destroyed: Your opponent loses 3A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.loseAmber({ amount: 3 })
        });
    }
}

HaplessCadet.id = 'hapless-cadet';

export default HaplessCadet;
