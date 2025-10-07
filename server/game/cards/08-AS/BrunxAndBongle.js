import Card from '../../Card.js';

class BrunxAndBongle extends Card {
    // After Fight: If this was the first time Brunx and Bongle was
    // used this turn, you may ready and reap with it.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) =>
                context.game.cardsUsed.filter((card) => card === context.source).length === 1,
            optional: true,
            effect: 'ready {1}',
            effectArgs: (context) => [context.source],
            gameAction: ability.actions.sequential([
                ability.actions.ready(),
                ability.actions.reap()
            ])
        });
    }
}

BrunxAndBongle.id = 'brunx-and-bongle';

export default BrunxAndBongle;
