const DrawCard = require('../../drawcard.js');

class YoungHarrier extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent other characters from being dishonored',
            cost: ability.costs.dishonorSelf(),
            handler: () => {
                this.game.addMessage('{0} dishonors {1} to prevent Crane characters from being dishonored this phase', this.controller, this);
                this.controller.cardsInPlay.each(card => {
                    if(card.isFaction('crane')) {
                        this.untilEndOfPhase(ability => ({
                            match: card,
                            effect: ability.effects.cannotBeDishonored()
                        }));
                    }
                });
            }
        });
    }
}

YoungHarrier.id = 'young-harrier';

module.exports = YoungHarrier;
