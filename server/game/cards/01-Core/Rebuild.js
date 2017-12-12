const DrawCard = require('../../drawcard.js');

class Rebuild extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put a holding into play from your discard',
            targets: {
                cardToShuffle: {
                    activePromptTitle: 'Choose a card to shuffle into your deck',
                    cardCondition: card => {
                        return (['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location) && 
                                card.isDynasty && 
                                !this.controller.getProvinceCardInProvince(card.location).isBroken);
                    }
                },
                cardToRebuild: {
                    activePromptTitle: 'Choose a card to put into the province',
                    cardType: 'holding',
                    cardCondition: card => card.location === 'dynasty discard pile' && card.controller === this.controller
                }
            },
            handler: context => {
                let location = context.targets.cardToShuffle.location;
                this.game.addMessage('{0} plays {1} and shuffles {2} back into their deck, replacing it with {3}', this.controller, this, context.targets.cardToShuffle.facedown ? 'a facedown card' : context.targets.cardToShuffle, context.targets.cardToRebuild);
                this.controller.moveCard(context.targets.cardToShuffle, 'dynasty deck');
                this.controller.shuffleDynastyDeck();
                this.controller.moveCard(context.targets.cardToRebuild, location);
                context.targets.cardToRebuild.facedown = false;
            }
        });
    }
}

Rebuild.id = 'rebuild';

module.exports = Rebuild;
