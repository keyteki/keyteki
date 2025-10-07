import Card from '../../Card.js';

class Wikolia extends Card {
    // Reap: Keys cost +2A during your opponent's next turn.
    setupCardAbilities(ability) {
        this.reap({
            effect: "increase key cost by 2 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(2)
            })
        });
    }
}

Wikolia.id = 'wikolia';

export default Wikolia;
