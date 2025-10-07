import Card from '../../Card.js';

class FathomReaver extends Card {
    // Play: Make a token creature. While you control a token creature,
    // your opponent refills their hand to 1 less card during the "draw cards" step.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.player.creaturesInPlay.some((card) => card.isToken()),
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

FathomReaver.id = 'fathom-reaver';

export default FathomReaver;
