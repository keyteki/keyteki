import Card from '../../Card.js';

class CorrosiveMonk extends Card {
    // Each creature is considered to have 0 armor. Each creature cannot gain armor.
    // Fate: Destroy a friendly creature for each enemy Mutant creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.setArmor(0)
        });

        this.fate({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                mode: 'exactly',
                numCards: (context) =>
                    context.game.activePlayer.opponent.creaturesInPlay.filter((card) =>
                        card.hasTrait('mutant')
                    ).length,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

CorrosiveMonk.id = 'corrosive-monk';

export default CorrosiveMonk;
