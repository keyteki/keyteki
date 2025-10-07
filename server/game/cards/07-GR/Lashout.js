import Card from '../../Card.js';

class LashOut extends Card {
    // Play: If you are haunted, deal 3 D to a creature with 3
    // splash. Otherwise, deal 3 D to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 3,
                    splash: context.player.isHaunted() ? 3 : 0
                }))
            }
        });
    }
}

LashOut.id = 'lash-out';

export default LashOut;
