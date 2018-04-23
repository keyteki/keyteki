const DrawCard = require('../../drawcard.js');

class SavvyPolitician extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            when: {
                'onCardHonored': (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                gameAction: 'honor'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to honor {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { honor: context.target });
            }
        });
    }
}

SavvyPolitician.id = 'savvy-politician';

module.exports = SavvyPolitician;
