const DrawCard = require('../../drawcard.js');

class TheMirrorsGaze extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Mirror an opponent\'s event',
            when: {
                onAbilityResolved: (event, context) => {
                    let ability = event.context.ability;
                    if(event.initiateEvent.cancelled || event.card.type !== 'event' || ability.cannotBeMirrored) {
                        return false;
                    } else if(event.context.player !== context.player.opponent || context.player.isAbilityAtMax(ability.maxIdentifier)) {
                        return false;
                    }
                    let newContext = event.context.ability.createContext(context.player);
                    if(ability.targets.length === 0) {
                        return ability.gameAction.length === 0 || ability.gameAction.some(action => action.hasLegalTarget(newContext));
                    }
                    return ability.canResolveTargets(context);
                }
            },
            gameAction: ability.actions.resolveAbility(context => ({
                target: context.event.card,
                ability: context.event.context.ability
            }))
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('shugenja') === false || card.controller !== context.player) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

TheMirrorsGaze.id = 'the-mirror-s-gaze';

module.exports = TheMirrorsGaze;
