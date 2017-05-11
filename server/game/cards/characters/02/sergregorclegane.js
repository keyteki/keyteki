const DrawCard = require('../../../drawcard.js');

class SerGregorClegane extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPillage: (event, challenge, card, discarded) => card === this && discarded.getType() === 'character'
            },
            handler: context => {
                var discarded = context.event.params[3];
                discarded.controller.moveCard(discarded, 'dead pile');
                this.game.addMessage('{0} uses {1} to place {2} in {3}\'s dead pile', this.controller, this, discarded, discarded.controller);

                if(!this.game.allCards.any(card => this.cardCondition(discarded, card))) {
                    return;
                }

                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(discarded, card),
                    activePromptTitle: 'Select a character to kill',
                    source: this,
                    gameAction: 'kill',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(discarded, card) {
        return card.location === 'play area' && card.getType() === 'character' && card.getCost() === discarded.getCost();
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, card);
        card.controller.killCharacter(card);
        return true;
    }
}

SerGregorClegane.code = '02049';

module.exports = SerGregorClegane;
