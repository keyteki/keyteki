const DrawCard = require('../../../drawcard.js');

class LadyInWaiting extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card === this && this.game.currentPhase === 'marshal' && this.controller.gold >= 2
            },
            handler: () => {
                this.marshalAsDupe();
            }
        });
    }
    marshalAsDupe() {
        this.controller.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Lady'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
        return true;
    }
    onCardSelected(player, card) {
        this.controller.removeCardFromPile(this);
        card.addDuplicate(this);
        this.controller.gold += 2;
        this.game.addMessage('{0} places {1} on {2} as a duplicate', this.controller, this, card);
        return true;
    }
}

LadyInWaiting.code = '02023';

module.exports = LadyInWaiting;
