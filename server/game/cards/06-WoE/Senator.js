import Card from '../../Card.js';

class Senator extends Card {
    // Action: Keys cost +1A during your opponent's next turn.
    setupCardAbilities(ability) {
        this.action({
            effect: "increase key cost by 1 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(1)
            })
        });
    }
}

Senator.id = 'senator';

export default Senator;
