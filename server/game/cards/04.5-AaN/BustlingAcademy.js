const DrawCard = require('../../drawcard.js');

class BustlingAcademy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card in a province and refill it faceup',
            condition: context => context.player.cardsInPlay.any(card => card.hasTrait('scholar')) && context.player.opponent,
            target: {
                location: 'province',
                cardType: ['character','holding'],
                gameAction: ability.actions.discardCard()
            },
            then: context => {
                let location = context.target.location;
                let controller = context.target.controller;
                return {
                    handler: () => {
                        let card = controller.getDynastyCardInProvince(location);
                        if(card) {
                            card.facedown = false;
                        }
                    }
                };
            }
        });
    }
}

BustlingAcademy.id = 'bustling-academy';

module.exports = BustlingAcademy;
