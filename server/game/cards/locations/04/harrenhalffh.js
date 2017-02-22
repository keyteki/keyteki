const DrawCard = require('../../../drawcard.js');

class Harrenhal extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel Harrenhal to put a character in play',
            method: 'kneel',
            phase: 'challenge'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.location === 'hand' && card.getType() === 'character' && card.controller === this.controller &&
                (card.isFaction('lannister') || card.hasTrait('House Bolton')),
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        player.kneelCard(this);

        player.moveCard(card, 'play area');

        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.killIfStillInPlay(false)
        }));

        this.game.addMessage('{0} kneels {1} to put {2} into play from their hand', player, this, card);

        return true;
    }
}

Harrenhal.code = '04050';

module.exports = Harrenhal;
