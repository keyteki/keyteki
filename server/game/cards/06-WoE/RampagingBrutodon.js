import Card from '../../Card.js';

class RampagingBrutodon extends Card {
    // Play: Make a token creature.
    //
    // In order to use Rampaging Brutodon, you must destroy a friendly
    // creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.additionalCost((context) => {
                if (
                    context.source === this &&
                    (!context.ability ||
                        !context.ability.properties ||
                        context.ability.properties.name !== 'Play')
                ) {
                    return ability.costs.destroyFriendlyCreature();
                }
            })
        });
    }
}

RampagingBrutodon.id = 'rampaging-brutodon';

export default RampagingBrutodon;
