import Card from '../../Card.js';

class VeilOfEctoplasm extends Card {
    // Play: For each Geistoid card in your discard pile, a friendly
    // creature captures 1 A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent && context.player.opponent.amber > 0,
            effect:
                'capture 1 amber on a friendly creature for each Geistoid creature in your discard pile',
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: Math.min(
                    context.player.opponent.amber,
                    context.player.discard.filter((c) => c.hasHouse('geistoid')).length
                ),
                action: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to capture 1 amber',
                        cardType: 'creature',
                        controller: 'self'
                    }
                })
            }))
        });
    }
}

VeilOfEctoplasm.id = 'veil-of-ectoplasm';

export default VeilOfEctoplasm;
