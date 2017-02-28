const DrawCard = require('../../../drawcard.js');

class Pyke extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Pyke to give a character stealth',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain stealth',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area';
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} kneels {1} to make {2} gain stealth', player, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.addKeyword('Stealth')
        }));

        return true;
    }
}

Pyke.code = '04013';

module.exports = Pyke;
