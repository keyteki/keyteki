const DrawCard = require('../../drawcard.js');

class Rout extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: (card, context) => context.player.cardsInPlay.some(myCard => (
                    myCard.hasTrait('bushi') && myCard.militarySkill > card.militarySkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

Rout.id = 'rout';

module.exports = Rout;
