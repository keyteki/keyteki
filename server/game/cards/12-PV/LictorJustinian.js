import Card from '../../Card.js';

class LictorJustinian extends Card {
    // After your opponent plays a card, deal 1D to each enemy creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent
            },
            effect: 'deal 1 damage to each enemy creature',
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.creaturesInPlay,
                amount: 1
            }))
        });
    }
}

LictorJustinian.id = 'lictor-justinian';

export default LictorJustinian;
