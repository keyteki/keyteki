const DrawCard = require('../../drawcard.js');

class Harmonize extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home from each side',
            condition: () => this.controller.isDefendingPlayer(),
            targets: {
                myCharacter: {
                    cardType: 'character',
                    cardCondition: card => card.isDefending() 
                },
                oppCharacter: {
                    cardType: 'character',
                    dependsOn: 'myCharacter',
                    cardCondition: (card, context) => card.isAttacking() && card.getCost() <= context.targets.myCharacter.getCost()
                }
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, sending {2} and {3} home', this.controller, this, context.targets.myCharacter, context.targets.oppCharacter);
                this.game.currentConflict.sendHome([context.targets.myCharacter, context.targets.oppCharacter]);
            }
        });
    }
}

Harmonize.id = 'harmonize';

module.exports = Harmonize;
