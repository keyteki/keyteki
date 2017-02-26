const DrawCard = require('../../../drawcard.js');

class SyrioForel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character military icon and stealth',
            method: 'giveIcon',
            limit: ability.limit.perPhase(1)
        });
    }

    giveIcon(player) {
        if(this.location !== 'play area' || player.phase !== 'challenge' || this.controller !== player) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.controller === this.controller;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to give {2} a {3} icon and stealth until the end of the phase', player, this, card, 'military');
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: [
                ability.effects.addIcon('military'),
                ability.effects.addKeyword('Stealth')
            ]
        }));

        return true;
    }
}

SyrioForel.code = '02037';

module.exports = SyrioForel;
