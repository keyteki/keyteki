const Card = require('../../Card.js');

class Mimicry extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.source === context.source &&
                    event.context.ability.title === 'Play this action'
            },
            location: ['hand', 'deck', 'purged', 'archives'],
            target: {
                cardType: 'action',
                controller: 'opponent',
                location: 'discard'
            },
            effect: 'to copy {0}',
            gameAction: ability.actions.cardLastingEffect(context => {
                let card = context.target;
                let effects = [];
                if(card) {
                    effects.push(ability.effects.modifyAmberValue(card.printedAmber));
                    if(card.abilities.reactions.some(ability => ability.properties.name === 'Play')) {
                        effects.push(ability.effects.gainAbility('play',
                            card.abilities.reactions.find(ability => ability.properties.name === 'Play').properties
                        ));
                    }
                }
                return {
                    targetLocation: 'hand',
                    effect: effects
                };
            })
        });
    }
}

Mimicry.id = 'mimicry'; // This is a guess at what the id might be - please check it!!!

module.exports = Mimicry;
