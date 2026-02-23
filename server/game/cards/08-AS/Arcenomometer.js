import Card from '../../Card.js';
class Arcenomometer extends Card {
    // Action: During your opponent’s next turn, each time they play a
    // card, they lose 1A.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} lose an amber each time they play a card during their next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.duringOpponentNextTurn({
                when: {
                    onCardPlayed: () => true
                },
                gameAction: ability.actions.loseAmber()
            })
        });
    }
}

Arcenomometer.id = 'arcenomometer';

export default Arcenomometer;
