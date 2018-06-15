const DrawCard = require('../../drawcard.js');

class WalkingTheWay extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            targetController: 'any',
            match: player => player.cardsInPlay.any(card => card.hasTrait('shugenja')),
            effect: ability.effects.reduceCost({ playingTypes: 'play', match: card => card === this })
        });
        this.action({
            title: 'Place a card from your deck faceup on a province',
            condition: context => context.player.dynastyDeck.size() > 0,
            effect: 'look at the top three cards of their dynasty deck',
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place in a province',
                context: context,
                cards: context.player.dynastyDeck.first(3),
                cardHandler: cardFromDeck => this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a card to replace with ' + cardFromDeck.name,
                    context: context,
                    cardType: ['holding', 'character'],
                    location: 'province',
                    controller: 'self',
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} discards {1}, replacing it with {2}', player, card, cardFromDeck);
                        player.moveCard(cardFromDeck, card.location);
                        cardFromDeck.facedown = false;
                        player.moveCard(card, 'dynasty discard pile');
                        player.shuffleDynastyDeck();
                        return true;
                    }
                })
            })
        });
    }
}

WalkingTheWay.id = 'walking-the-way';

module.exports = WalkingTheWay;
