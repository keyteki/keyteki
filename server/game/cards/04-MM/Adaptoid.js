const Card = require('../../Card.js');

class Adaptoid extends Card {
    // Enhance PTDR.
    // After you play a card with a bonus icon, for the remainder of the turn, Adaptoid gains (choose one): +2 armor, assault 2, or Fight: Steal 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.bonusIcons.length > 0 && event.player === context.player
            },
            target: {
                mode: 'select',
                choices: {
                    '+2 armor': ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        effect: ability.effects.modifyArmor(2)
                    })),
                    'Assault 2': ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        effect: ability.effects.addKeyword({ assault: 2 })
                    })),
                    'Fight: Steal 1 amber': ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        effect: ability.effects.gainAbility('fight', {
                            gameAction: ability.actions.steal()
                        })
                    }))
                }
            }
        });
    }
}

Adaptoid.id = 'adaptoid';

module.exports = Adaptoid;
