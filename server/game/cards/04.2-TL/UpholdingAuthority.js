const ProvinceCard = require('../../provincecard.js');

class UpholdingAuthority extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.controller.role.hasTrait('earth'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Look at opponent\'s hand and discard all copies of a card',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && context.player.opponent
            },
            effect: 'look at their opponent\'s hand and choose a card to be discarded',
            gameAction: ability.actions.discardCard(context => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to discard',
                    cards: context.player.opponent.hand.sortBy(card => card.name),
                    choices: ['Don\'t discard anything'],
                    handlers: [() => context.game.addMessage('{0} chooses not to discard anything', context.player)],
                    customHandler: (card, gameAction) => this.cardSelected(context, card, gameAction)
                }
            }))
        });
    }

    cardSelected(context, card, gameAction) {
        this.game.addMessage('{0} reveals their hand: {1}', context.player.opponent, context.player.opponent.hand.sortBy(card => card.name));
        let cards = context.player.opponent.hand.filter(c => c.id === card.id);
        if(cards.length === 1) {
            gameAction.setTarget(cards);
            context.game.addMessage('{0} chooses to discard {1}', context.player, card);
            return;
        }
        let choices = Array.from(Array(cards.length + 1), (x, i) => i);
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose how many cards to discard',
            choices: choices,
            choiceHandler: choice => this.numberToDiscardSelected(context, cards, gameAction, choice)
        });
    }

    numberToDiscardSelected(context, cards, gameAction, choice) {
        if(choice === 0) {
            context.game.addMessage('{0} chooses not to discard anything', context.player);
            return;
        }
        gameAction.setTarget(cards.splice(0, choice));
        this.game.addMessage('{0} chooses to discard {1} cop{2} of {3}', context.player, choice, choice === 1 ? 'y' : 'ies', cards[0]);
    }
}

UpholdingAuthority.id = 'upholding-authority'; // This is a guess at what the id might be - please check it!!!

module.exports = UpholdingAuthority;
