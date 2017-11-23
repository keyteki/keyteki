const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class MagnificentLighthouse extends DrawCard {
    setupCardAbilities() {
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
                let messages = ['{0} places a card on the bottom of the deck', '{0} chooses to discard {1}'];
                let destinations = [topThree[0].isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom', topThree[0].isDynasty ? 'dynasty discard pile' : 'conflict discard pile'];
                let choices = [];
                let handlers = _.map(topThree, card => {
                    return () => {
                        this.game.addMessage(messages.pop(), this.controller, card);
                        this.controller.opponent.moveCard(card, destinations.pop());
                        if(messages.length > 0) {
                            let index = _.indexOf(topThree, card);
                            topThree.splice(index, 1);
                            handlers.splice(index, 1);
                            this.game.promptWithHandlerMenu(this.controller, {
                                activePromptTitle: 'Select a card to put on the bottom of the deck',
                                source: this,
                                cards: topThree,
                                handlers: handlers,
                                choices: choices
                            });
                        }
                    };
                });
                if(topThree.length < 3) {
                    choices = ['None'];
                    handlers.push(() => {
                        if(topThree.length === 2) {
                            choices.pop();
                            handlers.pop();
                        }
                        messages.pop();
                        destinations.pop();
                        if(messages.length > 0) {
                            this.game.promptWithHandlerMenu(this.controller, {
                                activePromptTitle: 'Select a card to put on the bottom of the deck',
                                source: this,
                                cards: topThree,
                                choices: choices,
                                handlers: handlers
                            });
                        }
                    });
                }
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Select a card to discard',
                    source: this,
                    cards: topThree,
                    handlers: handlers,
                    choices: choices
                });
            }
        });
    }
}

MagnificentLighthouse.id = 'magnificent-lighthouse';

module.exports = MagnificentLighthouse;
