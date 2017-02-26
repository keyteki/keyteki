const DrawCard = require('../../../drawcard.js');

class TheThingsIDoForLove extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card || player.faction.kneeled || player.phase !== 'challenge' || player.gold === 0) {
            return false;
        }

        if(!player.cardsInPlay.any(card => {
            return card.hasTrait('Lord') || card.hasTrait('Lady');
        })) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character' && card.getCost() <= player.gold,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        player.faction.kneeled = true;
        card.controller.moveCard(card, 'hand');
        player.gold -= card.getCost();

        this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand', player, this, card, card.owner);

        return true;
    }
}

TheThingsIDoForLove.code = '01101';

module.exports = TheThingsIDoForLove;
