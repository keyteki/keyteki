const DrawCard = require('../../drawcard.js');

class TogashiMendicant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Rearrange top 3 cards of dynasty deck',
            when: {
                onPhaseStarted: (event, context) => event.phase === 'fate' && context.player.dynastyDeck.size() > 0
            },
            effect: 'rearrange the top 3 cards of their dynasty deck',
            handler: context => this.togashiMendicantPrompt(context, context.player.dynastyDeck.first(3), [], 'Which card do you want to be on top?')
        });
    }

    togashiMendicantPrompt(context, promptCards, orderedCards, promptTitle) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.push(card);
                promptCards = promptCards.filter(c => c !== card);
                if(promptCards.length > 1) {
                    this.togashiMendicantPrompt(context, promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.push(promptCards[0]);
                }
                context.player.dynastyDeck.splice(0, 3, ...orderedCards);
            }
        });
    }
}

TogashiMendicant.id = 'togashi-mendicant';

module.exports = TogashiMendicant;
