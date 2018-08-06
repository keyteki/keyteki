const DrawCard = require('../../drawcard.js');

class Harmonize extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home from each side',
            cannotBeMirrored: true,
            targets: {
                myCharacter: {
                    cardCondition: (card, context) => card.isDefending() && card.controller === context.player,
                    gameAction: ability.actions.sendHome()
                },
                oppCharacter: {
                    dependsOn: 'myCharacter',
                    cardCondition: (card, context) => card.isAttacking() && card.costLessThan(context.targets.myCharacter.getCost() + 1),
                    gameAction: ability.actions.sendHome()
                }
            },
            effect: 'send home {1} and {2}',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }
}

Harmonize.id = 'harmonize';

module.exports = Harmonize;
