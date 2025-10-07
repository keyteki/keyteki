import Card from '../../Card.js';

class AceJonavan extends Card {
    // For each A on Ace Jonavan, keys cost +1A.
    // Play: Capture 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });

        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost((_, context) => context.source.amber)
        });
    }
}

AceJonavan.id = 'ace-jonavan';

export default AceJonavan;
