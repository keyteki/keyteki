import Card from '../../Card.js';

class MasterTashi extends Card {
    // After Fight: Ready and reap with a neighboring creature.
    // After Reap: Ready and fight with a neighboring creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.reap()
                ])
            },
            effect: 'ready and reap with a neighboring creature'
        });

        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with a neighboring creature'
        });
    }
}

MasterTashi.id = 'master-tashi';

export default MasterTashi;
