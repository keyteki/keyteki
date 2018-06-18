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
                    cardCondition: (card, context) => card.isAttacking() && card.getCost() <= context.targets.myCharacter.getCost(),
                    gameAction: ability.actions.sendHome()
                }
            }
        });
    }
}

Harmonize.id = 'harmonize';

module.exports = Harmonize;
