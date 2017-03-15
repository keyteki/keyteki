const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class MaesterOfStarfall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to remove keyword',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character',
                    activePromptTitle: 'Select a character to lose keyword',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });                
            }
        });
    }

    onCardSelected(player, card) {
        var keywords = ['Insight', 'Intimidate', 'Pillage', 'Renown'];

        this.selectedCard = card;

        var buttons = _.map(keywords, keyword => {
            return { text: keyword, method: 'keywordSelected', arg: keyword.toLowerCase() };
        });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select a keyword to remove',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    keywordSelected(player, keyword) {
        this.untilEndOfPhase(ability => ({
            match: this.selectedCard,
            effect: ability.effects.removeKeyword(keyword)
        }));

        this.game.addMessage('{0} kneels {1} to remove the {2} keyword from {3}', player, this, keyword, this.selectedCard);

        return true;
    }
}

MaesterOfStarfall.code = '02076';

module.exports = MaesterOfStarfall;
