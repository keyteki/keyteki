const DrawCard = require('../../drawcard.js');

class Fushicho extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Resurrect a character',
            when: {
                onCardLeavesPlay: event => event.card === this
            },
            target: {
                activePrompt: 'Choose a character',
                cardType: 'character',
                gameAction: 'putIntoPlay', 
                cardCondition: card => card.location === 'dynasty discard pile' &&
                                       card.controller === this.controller && card.isFaction('phoenix')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resurrect {2}', this.controller, this, context.target);
                let event = this.game.applyGameAction(context, { putIntoPlay: context.target })[0];
                event.fate = 1;
            }
        });
    }
}

Fushicho.id = 'fushicho';

module.exports = Fushicho;
