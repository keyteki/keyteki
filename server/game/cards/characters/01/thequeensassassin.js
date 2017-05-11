const DrawCard = require('../../../drawcard.js');

class TheQueensAssassin extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'ambush'
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
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character',
                    gameAction: 'kill',
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
