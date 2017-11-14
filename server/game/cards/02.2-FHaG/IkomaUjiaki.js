const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class IkomaUjiaki extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put 2 characters into play',
            cost: ability.costs.discardImperialFavor(),
            condition: () => _.any(['province 1', 'province 2', 'province 3', 'province 4'], location => {
                let card = this.controller.getDynastyCardInProvince(location);
                return card.facedown;
            }),
            handler: () => {
                let revealedCards = [];
                _.each(['province 1', 'province 2', 'province 3', 'province 4'], location => {
                    let card = this.controller.getDynastyCardInProvince(location);
                    if(card && card.facedown) {
                        revealedCards.push(card);
                        card.facedown = false;
                    } 
                });
                if(revealedCards.length > 0) {
                    this.game.addMessage('{0} discards the Imperial Favor to use {1}, revealing {2}', this.controller, this, revealedCards);
                    this.game.promptForSelect(this.controller, {
                        mode: 'upTo',
                        numCards: 2,
                        activePrompt: 'Choose up to 2 characters',
                        cardType: 'character',
                        source: this,
                        cardCondition: card => {
                            return (['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                                this.controller.canPutIntoPlay(card, true) && !card.facedown && card.controller === this.controller);
                        },
                        onSelect: (player, cards) => {
                            this.game.addMessage('{0} puts {1} into play', player, cards);
                            player.putIntoPlay(cards, true);
                            return true;
                        }
                    });
                }
            }
        });
    }
}

IkomaUjiaki.id = 'ikoma-ujiaki';

module.exports = IkomaUjiaki;
