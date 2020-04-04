const Card = require('../../Card.js');

class Replicator extends Card {
    setupCardAbilities(ability) {
        this.reap({
            targets: {
                creature: {
                    cardType: 'creature',
                    cardCondition: (card, context) => card !== context.source
                },
                ability: {
                    dependsOn: 'creature',
                    mode: 'options',
                    options: context => context.targets.creature.abilities.reactions.filter(ability => ability.isReap()).map(ability => ({
                        name: ability.card.name,
                        value: ability.card.name
                    }))
                }
            },
            gameAction: ability.actions.resolveAbility(context => ({
                target: context.targets.creature,
                ability: context.targets.creature && context.targets.creature.abilities.reactions.filter(ability => ability.isReap()).find(ability =>
                    ability.card.name === context.option.value)
            })),
            effect: 'trigger {0}\'s Reap: abilitiy {1}{2}',
            effectArgs: context => context.option.value === context.targets.creature.name ? [] : ['gained from ', context.option.value]
        });
    }
}

Replicator.id = 'replicator';

module.exports = Replicator;
