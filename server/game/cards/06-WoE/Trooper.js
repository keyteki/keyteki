import Card from '../../Card.js';

class Trooper extends Card {
    //After Fight/After Reap: Exalt $this.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.exalt((context) => ({
                target: context.source,
                amount: 1
            }))
        });
    }
}

Trooper.id = 'trooper';

export default Trooper;
