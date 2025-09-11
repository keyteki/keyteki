const Card = require('../../Card.js');

class StealthModifications extends Card {
    // This creature and each of its neighbors gains elusive.
    // Play: Ward this creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.ward((context) => ({
                target: context.source.parent.neighbors.concat(context.source.parent)
            }))
        });

        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ elusive: 1 }),
                ability.effects.gainAbility('persistentEffect', {
                    match: (card, context) => context.source.neighbors.includes(card),
                    effect: ability.effects.addKeyword({ elusive: 1 })
                })
            ]
        });
    }
}

StealthModifications.id = 'stealth-modifications';

module.exports = StealthModifications;
