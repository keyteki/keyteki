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
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place in a province',
                source: context.source,
                cards: context.player.dynastyDeck.first(3),
                cardHandler: cardFromDeck => this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a card to replace with ' + cardFromDeck.name,
                    source: context.source,
                    cardType: ['holding', 'character'],
                    cardCondition: card => card.location.includes('province'),
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} plays {1} and discards {2}, replacing it with {3}', player, context.source, card, cardFromDeck);
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
