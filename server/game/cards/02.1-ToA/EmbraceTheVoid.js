const DrawCard = require('../../drawcard.js');

class EmbraceTheVoid extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Take Fate',
            when: {
                onCardRemoveFate: event => {
                    console.log(event.card.name, event.fate)
                    return event.card === this.parent && event.fate > 0;
                }
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to take the {2} fate being removed from {3}', this.controller, this, context.event.fate, this.parent);
                context.event.recipient = this.controller;
            }
        });
    }
}

EmbraceTheVoid.id = 'embrace-the-void';

module.exports = EmbraceTheVoid;
