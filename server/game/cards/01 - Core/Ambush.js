const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class Ambush extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.game.currentConflict,
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Choose up to two characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 2,
                multiSelect: true,
                cardType: 'character',
                cardCondition: card => {
                    return (card.isFaction('scorpion') && 
                            ['hand', 'province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) &&
                            this.controller.canPutIntoPlay(card));
                }
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, putting {2}{3} into the conflict', this.controller, this, context.target[0], context.target.length > 1 ? ' and ' + context.target[1].name : '');
                _.each(context.target, card => this.controller.putIntoPlay(card, true));
            }
        });
    }
}

Ambush.id = 'ambush';

module.exports = Ambush;
