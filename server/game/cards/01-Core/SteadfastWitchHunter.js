const DrawCard = require('../../drawcard.js');

class SteadfastWitchHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready character',
            cost: ability.costs.sacrifice(card => card.getType() === 'character'),
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardType: 'character',
                gameAction: ability.actions.ready()
            }
        });
    }
}

SteadfastWitchHunter.id = 'steadfast-witch-hunter';

module.exports = SteadfastWitchHunter;
