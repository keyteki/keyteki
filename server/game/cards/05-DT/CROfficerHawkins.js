import Card from '../../Card.js';

class CROfficerHawkins extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play: Gain 1A for each of C.R. Officer Hawkins's non-Star Alliance neighbors.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.neighbors.filter((c) => !c.hasHouse('staralliance')).length
            }))
        });
    }
}

CROfficerHawkins.id = 'cr-officer-hawkins';

export default CROfficerHawkins;
