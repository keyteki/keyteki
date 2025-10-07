import Card from '../../Card.js';

class EmeraldDuelist extends Card {
    // After Fight: Each of Emerald Duelist’s neighbors capture 1A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.neighbors,
                amount: 1
            }))
        });
    }
}

EmeraldDuelist.id = 'emerald-duelist';

export default EmeraldDuelist;
