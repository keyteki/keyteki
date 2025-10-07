import Card from '../../Card.js';

class ClearMind extends Card {
    // Play: Unstun each friendly creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.removeStun((context) => ({
                target: context.player.creaturesInPlay
            }))
        });
    }
}

ClearMind.id = 'clear-mind';

export default ClearMind;
