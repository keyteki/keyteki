const DrawCard = require('../../../drawcard.js');

class TheTickler extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard opponents top card',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return true;
        }

        this.topCard = otherPlayer.drawDeck.first();
        otherPlayer.discardFromDraw(1);

        this.game.addMessage('{0} uses {1} to discard the top card of {2}\'s deck', player, this, otherPlayer);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a copy of ' + this.topCard.name + ' to discard',
            source: this,
            cardCondition: card => card.location === 'play area' && card.name === this.topCard.name,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        card.controller.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard a copy of {2} from play', player, this, card);

        return true;
    }
}

TheTickler.code = '01088';

module.exports = TheTickler;
