import Card from '../../Card.js';

class LapisaurusEvilTwin extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Fight: Exalt the creature Lapisaurus fights.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.exalt((context) => ({
                target: context.event.card
            }))
        });
    }
}

LapisaurusEvilTwin.id = 'lapisaurus-evil-twin';

export default LapisaurusEvilTwin;
