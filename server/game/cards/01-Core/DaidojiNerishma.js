const DrawCard = require('../../drawcard.js');

class DaidojiNerishma extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Flip a card faceup',
            target: {
                controller: 'self',
                location: 'province',
                cardCondition: card => card.isDynasty && card.facedown,
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}

DaidojiNerishma.id = 'daidoji-nerishma';

module.exports = DaidojiNerishma;
