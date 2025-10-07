import Card from '../../Card.js';

class Berserker extends Card {
    // Berserker enters play ready and enraged.
    // After Fight: Destroy Berserker.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.entersPlayReady(), ability.effects.entersPlayEnraged()]
        });
        this.fight({
            gameAction: ability.actions.destroy()
        });
    }
}

Berserker.id = 'berserker';

export default Berserker;
