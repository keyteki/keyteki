const DrawCard = require('../../../drawcard.js');

class Melisandre extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event =>
                    event.playingType === 'marshal' && event.card.controller === this.controller && event.card.hasTrait('R\'hllor'),
                onCardPlayed: (event, player, card) =>
                    card.controller === this.controller && card.hasTrait('R\'hllor')
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select a character to kneel',
                    source: this,
                    gameAction: 'kneel',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && !card.kneeled;
    }

    onCardSelected(player, card) {
        player.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }
}

Melisandre.code = '01047';

module.exports = Melisandre;
