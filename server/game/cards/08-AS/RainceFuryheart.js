import Card from '../../Card.js';

class RainceFuryheart extends Card {
    // Before Fight: Exalt the creature Raince Furyheart fights.
    setupCardAbilities(ability) {
        this.beforeFight({
            gameAction: ability.actions.exalt((context) => ({
                target: context.event.card
            }))
        });
    }
}

RainceFuryheart.id = 'raince-furyheart';

export default RainceFuryheart;
