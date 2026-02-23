import Card from '../../Card.js';
import { buildPlayAsCopyEffects } from '../../helpers/playAsCopy.js';
class Mimicry extends Card {
    // When you play this card, treat it as a copy of an action card in your opponents discard pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.source === context.source &&
                    event.context.ability.title === 'Play this action'
            },
            location: 'any',
            target: {
                cardType: 'action',
                controller: 'opponent',
                location: 'discard'
            },
            effect: 'copy {0}',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                allowedLocations: 'any',
                target: context.source,
                effect: buildPlayAsCopyEffects({
                    context: context,
                    ability: ability
                })
            }))
        });
    }
}

Mimicry.id = 'mimicry';

export default Mimicry;
