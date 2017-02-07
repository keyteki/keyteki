const DrawCard = require('../../../drawcard.js');

class TheQueensAssassin extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => {
                    return this.wasAmbush && this === card;
                }
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                if(!otherPlayer) {
                    return;
                }

                if(this.controller.hand.size() <= otherPlayer.hand.size()) {
                    return;
                }

                this.game.promptForSelect(otherPlayer, {
                    activePromptTitle: 'Select a character to kill',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });

                this.game.addMessage('{0} uses {1} to force {2} to choose and kill a character', this.controller, this, otherPlayer);
            }
        });
    }

    onCardSelected(player, card) {
        card.owner.killCharacter(card);

        this.game.addMessage('{0} selected {1} to kill', player, card);

        return true;
    }
}

TheQueensAssassin.code = '01095';

module.exports = TheQueensAssassin;
