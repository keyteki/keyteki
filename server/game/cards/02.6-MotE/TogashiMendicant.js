const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TogashiMendicant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Rearrange top 3 cards of Dynasty deck',
            when: {
                onPhaseStarted: event => event.phase === 'fate' && this.controller.dynastyDeck.size() > 0
            },
            methods: ['togashiMendicantPrompt'],
            handler: () => {
                this.game.addMessage('{0} uses {1} to rearrange the top 3 cards of their deck', this.controller, this);
                this.togashiMendicantPrompt(this.controller.dynastyDeck.first(3), [], 'Which card do you want to be on top?');
            }
        });
    }

    togashiMendicantPrompt(promptCards, orderedCards, promptTitle) {
        this.game.promptWithHandlerMenu(this.controller, {
            activePromptTitle: promptTitle,
            source: this,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.unshift(card);
                promptCards = _.reject(promptCards, c => c === card);
                if(promptCards.length > 1) {
                    this.togashiMendicantPrompt(promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.unshift(promptCards[0]);
                }
                _.each(orderedCards, card => this.controller.dynastyDeck.unshift(card));
            }
        });
    }
}

TogashiMendicant.id = 'togashi-mendicant';

module.exports = TogashiMendicant;
