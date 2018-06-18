const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class IkomaUjiaki extends DrawCard {
    setupCardAbilities(ability) {
        // TODO: refactor this
        this.action({
            title: 'Put 2 characters into play',
            cost: ability.costs.discardImperialFavor(),
            condition: context => context.source.isParticipating() && ['province 1', 'province 2', 'province 3', 'province 4'].some(location => {
                let card = context.player.getDynastyCardInProvince(location);
                return card && card.facedown;
            }),
            effect: 'to reveal all their facedown dynasty cards',
            handler: context => {
                let revealedCards = [];
                _.each(['province 1', 'province 2', 'province 3', 'province 4'], location => {
                    let card = context.player.getDynastyCardInProvince(location);
                    if(card && card.facedown) {
                        revealedCards.push(card);
                        card.facedown = false;
                    }
                });
                if(revealedCards.length > 0) {
                    this.game.promptForSelect(context.player, {
                        mode: 'upTo',
                        numCards: 2,
                        activePrompt: 'Choose up to 2 characters',
                        cardType: 'character',
                        location: 'province',
                        controller: 'self',
                        context: context,
                        optional: true,
                        cardCondition: card => !card.facedown && card.allowGameAction('putIntoConflict', context),
                        onSelect: (player, cards) => {
                            this.game.addMessage('{0} reveals {1} and puts {2} into play', player, revealedCards, cards);
                            this.game.applyGameAction(context, { putIntoConflict: cards });
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
