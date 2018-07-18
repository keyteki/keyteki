const DrawCard = require('../../drawcard.js');

class SoulBeyondReproach extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor a character, then honor it again',
            target: {
                cardType: 'character',
                controller: 'self',
                gameAction: ability.actions.honor()
            },
            then: context => ({
                gameAction: ability.actions.honor({ target: context.target })
            })
        });
    }
}

SoulBeyondReproach.id = 'soul-beyond-reproach';

module.exports = SoulBeyondReproach;
