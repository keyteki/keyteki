const DrawCard = require('../../../drawcard.js');

class PaidOff extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.challengeType === 'intrigue' && !this.parent.kneeled && challenge.winner === this.controller
            },
            handler: () => {
                this.parent.controller.kneelCard(this.parent);

                this.game.addMessage('{0} uses {1} to kneel {2}', this.controller, this, this.parent);

                this.game.promptWithMenu(this.parent.controller, this, {
                    activePrompt: {
                        menuTitle: 'Pay 1 gold to stand ' + this.parent.name,
                        buttons: [
                            { text: 'Yes', method: 'stand' },
                            { text: 'No', method: 'cancel' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    stand(player) {
        if(player.gold < 1) {
            return false;
        }

        this.game.transferGold(this.controller, player, 1);

        player.standCard(this.parent);

        this.game.addMessage('{0} pays 1 gold to stand {1}', player, this.parent);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} does not pay 1 gold and {1} remains kneeled', player, this.parent);

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isParticipating(card) && card.getStrength() > this.parent.getStrength();
    }

    onCardSelected(player, card) {
        player.kneelCard(this);

        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} kneels {1} to remove {2} from the challenge', player, this, card);

        return true;
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller === this.controller) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

PaidOff.code = '02071';

module.exports = PaidOff;
