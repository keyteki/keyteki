const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class AgashaSwordsmith extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 card for attachment',
            limit: ability.limit.perRound(1),
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to look at the top five cards of their deck.', this.controller, this);
                let attachments = _.filter(this.controller.conflictDeck.first(5), card => card.type === 'attachment');
                let choices = _.map(attachments, card => card.name);
                let handlers = _.map(attachments, card => {
                    return () => {
                        this.controller.moveCard(card, 'hand');
                        this.game.addMessage('{0} takes {1} and adds it to their hand', this.controller, card);
                        this.controller.shuffleConflictDeck();
                        return true;
                    };
                });
                choices.push('Take nothing');
                handlers.push(() => {
                    this.game.addMessage('{0} takes nothing', this.controller);                    
                    this.controller.shuffleConflictDeck();
                    return true;
                });
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose a card',
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        });
    }
}

AgashaSwordsmith.id = 'agasha-swordsmith';

module.exports = AgashaSwordsmith;

