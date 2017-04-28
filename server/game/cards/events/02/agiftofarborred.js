const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class AGiftOfArborRed extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 4 cards of each deck',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let player = this.controller;
                this.thisPlayerCards = player.searchDrawDeck(4);

                this.revealCards(player, this.thisPlayerCards);

                this.otherPlayer = this.game.getOtherPlayer(player);
                if(this.otherPlayer) {
                    this.otherPlayerCards = this.otherPlayer.searchDrawDeck(4);
                    this.revealCards(this.otherPlayer, this.otherPlayerCards);
                }

                var buttons = _.map(this.thisPlayerCards, card => ({
                    method: 'selectThisPlayerCardForHand', card: card
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose a card to add to your hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    revealCards(player, cards) {
        this.game.addMessage('{0} uses {1} to kneel their faction card and reveal the top 4 cards of {2}\'s deck as: {3}', this.controller, this, player, cards);
    }

    selectThisPlayerCardForHand(player, cardId) {
        this.selectCardForHand(player, this.thisPlayerCards, cardId);

        if(!this.otherPlayer) {
            return true;
        }

        var buttons = _.map(this.otherPlayerCards, card => ({
            method: 'selectOtherPlayerCardForHand', card: card
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose opponent card to add to their hand',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    selectOtherPlayerCardForHand(player, cardId) {
        this.selectCardForHand(this.otherPlayer, this.otherPlayerCards, cardId);

        return true;
    }

    selectCardForHand(player, cards, cardId) {
        var card = _.find(cards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();

        this.game.addMessage('{0} adds {1} to {2}\'s hand and shuffles their deck',
                             this.controller, card, player);

        return true;
    }
}

AGiftOfArborRed.code = '02104';

module.exports = AGiftOfArborRed;
