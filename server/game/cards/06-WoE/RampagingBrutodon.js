const Card = require('../../Card.js');

class RampagingBrutodon extends Card {
    // Play: Make a token creature.
    //
    // In order to use Rampaging Brutodon, you must destroy a friendly
    // creature.
    setupCardAbilities(ability) {
        this.makeTokenOnPlay = ability.actions.makeTokenCreature();

        this.play({
            gameAction: this.makeTokenOnPlay
        });

        this.persistentEffect({
            targetController: 'self',
            effect: ability.effects.additionalCost((context) => {
                if (
                    context.source === this &&
                    (!context.ability.gameAction ||
                        context.ability.gameAction.length === 0 ||
                        context.ability.gameAction[0] !== this.makeTokenOnPlay)
                ) {
                    return ability.costs.destroyFriendlyCreature();
                }
            })
        });
    }
}

RampagingBrutodon.id = 'rampaging-brutodon';

module.exports = RampagingBrutodon;
