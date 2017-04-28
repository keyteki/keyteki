const PlotCard = require('../../../plotcard.js');

class WhisperCampaign extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => {
                    let card = event.card;
                    if(card.getType() !== 'character' || card.hasIcon('intrigue')) {
                        return false;
                    }

                    this.pendingCard = card;
                    return true;
                }
            },
            handler: () => {
                this.pendingCard.controller.kneelCard(this.pendingCard);
                this.game.addMessage('{0} is forced by {1} to kneel {2}', this.controller, this, this.pendingCard);
            }
        });
    }
}

WhisperCampaign.code = '07048';

module.exports = WhisperCampaign;
