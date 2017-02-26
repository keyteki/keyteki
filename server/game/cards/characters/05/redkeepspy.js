const DrawCard = require('../../../drawcard.js');

class RedKeepSpy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => (
                    this.wasAmbush && 
                    this === card &&
                    this.hasMoreCardsInHand()
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.controller !== this.controller && 
                        card.getType() === 'character' &&
                        card.getCost() <= 3),
                    onSelect: (player, card) => {
                        card.controller.moveCard(card, 'hand');
                        this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand', player, this, card, card.controller);

                        return true;
                    }
                });
            }
        });
    }
    
    hasMoreCardsInHand() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        return this.controller.hand.size() > otherPlayer.hand.size();
    }
}

RedKeepSpy.code = '05012';

module.exports = RedKeepSpy;
