const DrawCard = require('../../../drawcard.js');
const _ = require('underscore');

class Aggo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a Bloodrider (if a Summer plot is revealed)',
            method: 'stand',
            limit: ability.limit.perRound(1)
        });
    }

    stand(player) {
        if(!_.any(this.game.getPlayers(), player => {
            return player.activePlot.hasTrait('Summer');
        })) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Bloodrider'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to stand {2}', player, this, card);
        this.controller.standCard(card);
        return true;
    }
}

Aggo.code = '03035';

module.exports = Aggo;
