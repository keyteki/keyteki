const DrawCard = require('../../drawcard.js');

class HirumaKogoe extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Rearrange top 3 cards of your conflict deck',
            when: {
                onPhaseStarted: (event, context) => event.phase === 'draw' && context.player.opponent && context.player.honor < context.player.opponent.honor
            },
            effect: 'rearrange the top 3 cards of their conflict deck',
            handler: context => this.hirumaKogoePrompt(context, context.player.conflictDeck.first(3), [], 'Which card do you want to be on top?')
        });
    }

    hirumaKogoePrompt(context, promptCards, orderedCards, promptTitle) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.unshift(card);
                promptCards = promptCards.filter(c => c !== card);
                if(promptCards.length > 1) {
                    this.hirumaKogoePrompt(context, promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.unshift(promptCards[0]);
                }
                for(const card of orderedCards) {
                    context.player.conflictDeck.unshift(card);
                }
            }
        });
    }
}

HirumaKogoe.id = 'hiruma-kogoe';

module.exports = HirumaKogoe;
