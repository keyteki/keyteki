import Card from '../../Card.js';

class HonoredBattlemaster extends Card {
    // Enhance . Action: Ready and fight with one of Honored Battlemaster's neighbors.
    setupCardAbilities(ability) {
        this.action({
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

HonoredBattlemaster.id = 'honored-battlemaster';

export default HonoredBattlemaster;
