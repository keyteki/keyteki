const DrawCard = require('../../../drawcard.js');

class Halder extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel a location or attachment',
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.getFaction() === 'thenightswatch' && (card.getType() === 'attachment' || card.getType() === 'location') && !card.kneeled,
            activePromptTitle: 'Select location',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }
    
    onCardSelected(player, card) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.getFaction() === 'thenightswatch' && card.getType() === 'character',
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onStrCardSelected(player, card)
        });

        this.kneelingCard = card;

        return true;
    }

    onStrCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to kneels {2} to give {3} +1 STR until the end of the phase', player, this, this.kneelingCard, card);

        this.kneelingCard.controller.kneelCard(this.kneelingCard);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(1)
        }));

        return true;
    }
}

Halder.code = '02065';

module.exports = Halder;
