const DrawCard = require('../../../drawcard.js');

class CroneOfVaesDothrak extends DrawCard {

    canBeTriggered(event, player, card) {
        var standingDothrakis = this.controller.cardsInPlay.filter(
            card =>
                card.getType() === 'character'
                && !card.kneeled
                && card.hasTrait('Dothraki'));

        return (card.getType() === 'character'
                && player !== this.controller
                && standingDothrakis.length > 0);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (e, p, c) => this.canBeTriggered(e, p, c)
            },
            handler: context => {
                var discardedCard = context.event.params[2];

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a Dothraki character to kneel',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card =>
                        card.location === 'play area'
                        && card.getType() === 'character'
                        && card.hasTrait('Dothraki')
                        && !card.kneeled,
                    onSelect: (player, selectedCard) =>
                        this.onCardSelected(player, selectedCard, discardedCard)
                });
            }
        });
    }

    onCardSelected(player, selectedCard, discardedCard) {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if (!otherPlayer)
            return true;

        this.game.addMessage('{0} uses {1} to kneel {2} and place {3} in the dead pile of {4}',
                             player, this, selectedCard, discardedCard, otherPlayer);

        player.kneelCard(selectedCard);
        otherPlayer.moveCard(discardedCard, 'dead pile');

        return true;
    }
}

CroneOfVaesDothrak.code = '02053';

module.exports = CroneOfVaesDothrak;
