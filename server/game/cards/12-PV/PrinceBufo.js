import Card from '../../Card.js';

class PrinceBufo extends Card {
    // Fate: Your opponent forges a key at current cost.
    setupCardAbilities(ability) {
        this.fate({
            effect: 'forge a key at current cost',
            effectArgs: (context) => context.game.activePlayer.opponent,
            gameAction: ability.actions.forgeKey((context) => ({
                player: context.game.activePlayer.opponent
            }))
        });
    }
}

PrinceBufo.id = 'prince-bufo';

export default PrinceBufo;
