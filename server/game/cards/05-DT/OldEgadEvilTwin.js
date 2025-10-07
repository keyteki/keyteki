import Card from '../../Card.js';

class OldEgadEvilTwin extends Card {
    // Destroyed: Enrage each enemy creature.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.enrage((context) => ({
                target: context.player.opponent ? context.player.opponent.creaturesInPlay : []
            }))
        });
    }
}

OldEgadEvilTwin.id = 'old-egad-evil-twin';

export default OldEgadEvilTwin;
