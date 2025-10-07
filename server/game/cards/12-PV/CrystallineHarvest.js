import Card from '../../Card.js';

class CrystallineHarvest extends Card {
    // Play: For the remainder of the turn, gain 1 amber each time you play an action card (including this one).
    // Fate: For the remainder of the turn, lose 1 amber each time you play an action card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onCardPlayed: (event, context) =>
                        event.player === context.player && event.card.type === 'action'
                },
                gameAction: ability.actions.gainAmber()
            })
        });

        this.fate({
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onCardPlayed: (event, context) =>
                        event.player === context.game.activePlayer && event.card.type === 'action'
                },
                gameAction: ability.actions.loseAmber()
            })
        });
    }
}

CrystallineHarvest.id = 'crystalline-harvest';

export default CrystallineHarvest;
