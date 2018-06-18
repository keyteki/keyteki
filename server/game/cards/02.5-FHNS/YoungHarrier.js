const DrawCard = require('../../drawcard.js');

class YoungHarrier extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent other characters from being dishonored',
            cost: ability.costs.dishonorSelf(),
            effect: 'prevent Crane characters from being dishonored this phase',
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: 'untilEndOfPhase',
                target: context.player.cardsInPlay.filter(card => card.isFaction('crane')),
                effect: ability.effects.cardCannot('dishonor')
            }))
        });
    }
}

YoungHarrier.id = 'young-harrier';

module.exports = YoungHarrier;
