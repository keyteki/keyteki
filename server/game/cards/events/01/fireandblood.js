const DrawCard = require('../../../drawcard.js');

class FireAndBlood extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Shuffle card from dead pile back into deck',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.controller === this.controller && card.location === 'dead pile' && card.isUnique() && card.isFaction('targaryen')
            },
            handler: context => {
                if(context.target.hasTrait('Hatchling')) {
                    this.selectedCard = context.target;
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Put card into play?',
                            buttons: [
                                { text: 'Yes', method: 'putIntoPlay' },
                                { text: 'No', method: 'shuffle' }
                            ]
                        },
                        source: this
                    });
                } else {
                    this.shuffleCard(context.target);
                }
            }
        });
    }

    putIntoPlay(player) {
        player.putIntoPlay(this.selectedCard);

        this.game.addMessage('{0} uses {1} to remove {2} from their dead pile and put it into play', player, this, this.selectedCard);

        return true;
    }

    shuffle() {
        this.shuffleCard(this.selectedCard);

        return true;
    }

    shuffleCard(card) {
        this.controller.moveCard(card, 'draw deck');
        this.controller.shuffleDrawDeck();

        this.game.addMessage('{0} uses {1} to remove {2} from their dead pile and shuffle it into their deck', this.controller, this, card);
    }
}

FireAndBlood.code = '01177';

module.exports = FireAndBlood;
