import Card from '../../Card.js';

class SkyboosterSquadron extends Card {
    // Reap: Return Skybooster Squadron to your hand.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.returnToHand()
        });
    }
}

SkyboosterSquadron.id = 'skybooster-squadron';

export default SkyboosterSquadron;
