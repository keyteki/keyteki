const DrawCard = require('../../../drawcard.js');

class QuentynMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.firstPlayer,
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addKeyword('Stealth')
            ]
        });
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select a character to kill',
                    source: this,
                    gameAction: 'kill',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.getStrength() < this.getStrength();
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);

        this.game.addMessage('{0} uses {1} to kill {2}', player, this, card);

        return true;
    }
}

QuentynMartell.code = '03031';

module.exports = QuentynMartell;
