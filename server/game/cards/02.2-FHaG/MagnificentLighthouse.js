const DrawCard = require('../../drawcard.js');

class MagnificentLighthouse extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at top 3 cards',
            target: {
                mode: 'select',
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    'Dynasty Deck': () => this.controller.opponent && this.controller.opponent.dynastyDeck.size() > 0,
                    'Conflict Deck': () => this.controller.opponent && this.controller.opponent.conflictDeck.size() > 0
                }
            },
            handler: context => {
                let topThree = [];
                if(context.select === 'Dynasty Deck') {
                    topThree = this.controller.opponent.dynastyDeck.first(3);
                    this.game.addMessage('{0} uses {1} to look at the top {2} card{3} of {4}\'s dynasty deck', this.controller, this, topThree.length, topThree.length === 1 ? '' : 's', this.controller.opponent);
                } else {
                    topThree = this.controller.opponent.conflictDeck.first(3);
                    this.game.addMessage('{0} uses {1} to look at the top {2} card{3} of {4}\'s conflict deck', this.controller, this, topThree.length, topThree.length === 1 ? '' : 's', this.controller.opponent);                    
                }
                let handlers = _.map(topThree, card => {
                    this.game.addMessage('{0} chooses to discard {1}', this.controller, card);
                    this.controller.opponent.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
                })

            }
        });
    }
}

MagnificentLighthouse.id = 'magnificent-lighthouse';

module.exports = MagnificentLighthouse;
