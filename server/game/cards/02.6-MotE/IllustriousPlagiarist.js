const DrawCard = require('../../drawcard.js');

class IllustriousPlagiarist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy action abilty of opponent\'s top event',
            condition: context => context.player.opponent,
            target: {
                location: 'conflict discard pile',
                controller: 'opponent',
                cardCondition: (card, context) => card === context.player.opponent.conflictDiscardPile.find(card => card.type === 'event') && 
                                                  card.abilities.actions.length > 0,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    target: context.source, 
                    effect: context.target.abilities.actions.map(action => {
                        // We need to keep the old abilityIdentifier
                        let newProps = { printedAbility: false, abilityIdentifier: action.abilityIdentifier };
                        // If the copied ability has a max, we need to create a new instantiation of it, with the same max and reset event
                        if(action.properties.max) {
                            newProps.max = ability.limit.repeatable(action.properties.max.max, action.properties.max.eventName);
                        }
                        return ability.effects.gainAbility('action', Object.assign({}, action.properties, newProps));
                    })
                }))    
            },
            effect: 'copy {0}\'s action abilities'
        });
    }
}

IllustriousPlagiarist.id = 'illustrious-plagiarist';

module.exports = IllustriousPlagiarist;
