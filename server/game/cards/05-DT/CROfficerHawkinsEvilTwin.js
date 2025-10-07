import Card from '../../Card.js';

class CROfficerHawkinsEvilTwin extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play: Your opponent loses 1A for each of C.R. Officer Hawkins's non-Star Alliance neighbors.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.source.neighbors.filter((c) => !c.hasHouse('staralliance')).length
            }))
        });
    }
}

CROfficerHawkinsEvilTwin.id = 'cr-officer-hawkins-evil-twin';

export default CROfficerHawkinsEvilTwin;
