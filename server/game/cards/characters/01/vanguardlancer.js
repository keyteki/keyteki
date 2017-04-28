const DrawCard = require('../../../drawcard.js');

class VanguardLancer extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a card to discard power from',
                    source: this,
                    additionalButtons: [{ text: 'Faction Card', arg: 'faction' }],
                    cardCondition: card => card.controller !== this.controller && card.getPower() > 0,
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onMenuCommand: (player, arg) => this.selectFactionCard(player, arg),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to remove 1 power from {2}', player, this, card);

        card.modifyPower(-1);

        return true;
    }

    selectFactionCard(player) {
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return true;
        }

        this.game.addPower(otherPlayer, -1);

        this.game.addMessage('{0} uses {1} to remove 1 power from {2}\'s faction card', player, this, otherPlayer);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

VanguardLancer.code = '01057';

module.exports = VanguardLancer;
