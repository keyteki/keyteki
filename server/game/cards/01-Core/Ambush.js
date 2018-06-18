const DrawCard = require('../../drawcard.js');

class Ambush extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put characters from you hand or provinces into play',
            target: {
                activePromptTitle: 'Choose up to two characters',
                numCards: 2,
                mode: 'maxStat',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                cardType: 'character',
                location: ['hand', 'province'],
                controller: 'self',
                cardCondition: card => card.isFaction('scorpion'),
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

Ambush.id = 'ambush';

module.exports = Ambush;
