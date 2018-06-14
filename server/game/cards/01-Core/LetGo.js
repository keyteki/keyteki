const DrawCard = require('../../drawcard.js');

class LetGo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: 'attachment',
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

LetGo.id = 'let-go';

module.exports = LetGo;


