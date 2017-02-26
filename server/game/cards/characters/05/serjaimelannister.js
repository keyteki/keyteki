const DrawCard = require('../../../drawcard.js');

class SerJaimeLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackers.length === 1,
            match: card => card.hasTrait('Knight') && this.game.currentChallenge.isAttacking(card),
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Give an intrigue icon to a character',
            method: 'addIcon',
            limit: ability.limit.perPhase(1),
            phase: 'challenge'
        });
    }

    addIcon() {
        if(this.location !== 'play area') {
            return false;
        }

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select character',
            source: this,
            cardCondition: card => (
                card.location === 'play area' && 
                card.hasTrait('Kingsguard') && 
                card.getType() === 'character'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to give {2} an {3} icon', player, this, card, 'intrigue');
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.addIcon('intrigue')
        }));

        return true;
    }
}

SerJaimeLannister.code = '05005';

module.exports = SerJaimeLannister;
