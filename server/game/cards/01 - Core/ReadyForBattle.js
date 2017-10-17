const DrawCard = require('../../drawcard.js');

class ReadyForBattle extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardBowed: event => {
                    let context = this.game.getCurrentAbilityContext();
                    return (event.card.controller === this.controller && event.card.bowed &&
                            ((context.source === 'card' && context.card.controller !== this.controller) ||
                            (context.source === 'ring' && context.card === 'water')));
                }
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to ready {2}', this.controller, this, context.event.card);
                this.controller.readyCard(context.event.card);
            }
        });
    }
}

ReadyForBattle.id = 'ready-for-battle';

module.exports = ReadyForBattle;
