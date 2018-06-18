const DrawCard = require('../../drawcard.js');

class TogashiYokuni extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy another character\'s ability',
            target: {
                activePromptTitle: 'Select a character to copy from',
                mode: 'ability',
                cardType: 'character',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect(context => {
                    let newProps = { printedAbility: false, abilityIdentifier: context.targetAbility.abilityIdentifier };
                    if(context.targetAbility.properties.limit) {
                        // If the copied ability has a limit, we need to create a new instantiation of it, with the same max and reset event
                        newProps.limit = ability.limit.repeatable(context.targetAbility.properties.limit.max, context.targetAbility.properties.limit.eventName);
                    }
                    if(context.targetAbility.properties.max) {
                        // Same for max
                        newProps.max = ability.limit.repeatable(context.targetAbility.properties.max.max, context.targetAbility.properties.max.eventName);
                    }
                    return {
                        duration: 'untilEndOfPhase',
                        effect: ability.effects.gainAbility(context.targetAbility.abilityType, Object.assign({}, context.targetAbility.properties, newProps))
                    };
                })
            },
            effect: 'copy {1}\'s \'{2}\' ability',
            effectArgs: context => [context.targetAbility.card, context.targetAbility.title],
            max: ability.limit.perRound(1)
        });
    }
}

TogashiYokuni.id = 'togashi-yokuni';

module.exports = TogashiYokuni;

