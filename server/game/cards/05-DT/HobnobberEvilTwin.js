import Card from '../../Card.js';

class HobnobberEvilTwin extends Card {
    // Omni: If your opponent has exactly 1A, steal it.
    setupCardAbilities(ability) {
        this.omni({
            condition: (context) => context.player.opponent && context.player.opponent.amber === 1,
            gameAction: ability.actions.steal()
        });
    }
}

HobnobberEvilTwin.id = 'hobnobber-evil-twin';

export default HobnobberEvilTwin;
