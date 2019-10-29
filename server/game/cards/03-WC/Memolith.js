const Card = require('../../Card.js');

class Memolith extends Card {
    setupCardAbilities(ability) {
        this.action({
            targets: {
                graftOrTrigger: {
                    mode: 'select',
                    choices: {
                        'Graft an action card': (context) => context.player.hand.filter(card => card.type === 'action'),
                        'Trigger play effect': () => this.childCards.some(card => !card.facedown)
                    }
                },
                action: {
                    location: 'any',
                    controller: 'self',
                    dependsOn: 'graftOrTrigger',
                    cardCondition: (card, context) => context.selects.graftOrTrigger &&
                        (((context.selects.graftOrTrigger.choice === 'Graft an action card') && (card.location === 'hand') && (card.type === 'action'))
                            || ((context.selects.graftOrTrigger.choice === 'Trigger play effect') && (card.parent === this) && (!card.facedown))),
                    gameAction: [
                        ability.actions.graft(context => ({
                            parent: this,
                            target: context.selects.graftOrTrigger && context.selects.graftOrTrigger.choice === 'Graft an action card' ? context.targets.action : []
                        })),
                        ability.actions.resolveAbility(context => ({
                            ability: (context.selects.graftOrTrigger && context.selects.graftOrTrigger.choice === 'Trigger play effect') &&
                                context.targets.action && context.targets.action.abilities.reactions.find(ability => ability.properties.name === 'Play')
                        }))
                    ]
                }
            }
        });
    }
}

Memolith.id = 'memolith';

module.exports = Memolith;
