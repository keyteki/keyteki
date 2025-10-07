import Card from '../../Card.js';

class AlmsmasterEvilTwin extends Card {
    // Deploy.
    // Each of Almsmaster's neighbors gains, "Destroyed: Steal 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

AlmsmasterEvilTwin.id = 'almsmaster-evil-twin';

export default AlmsmasterEvilTwin;
