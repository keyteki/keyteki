const DrawCard = require('../../drawcard.js');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardHonored: () => true,
                onCardDishonored: () => true
            },
            canCancel: true,
            handler: context => {
                context.cancel();
                if(context.event.name === 'onCardHonored') {
                    this.game.promptForSelect(this.controller, {
                        activePrompt: 'Select a character to honor',
                        cardType: 'character',
                        cardCondition: card => {
                            return (card !== context.event.card && 
                                    card.location === 'play area' && 
                                    card.controller === context.event.card.controller &&
                                    !card.isHonored);
                        },
                        source: this,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} to honor {2} instead of {3}', player, this, card, context.event.card);
                            player.honorCard(card);
                            return true;
                        }
                    });                
                } else {
                    this.game.promptForSelect(this.controller, {
                        activePrompt: 'Select a character to dishonor',
                        cardType: 'character',
                        cardCondition: card => {
                            return (card !== context.event.card && 
                                    card.location === 'play area' && 
                                    card.controller === context.event.card.controller &&
                                    card.allowGameAction('dishonor'));
                        },
                        source: this,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} to dishonor {2} instead of {3}', player, this, card, context.event.card);
                            player.dishonorCard(card);
                            return true;
                        }
                    });       
                }
            } 
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
