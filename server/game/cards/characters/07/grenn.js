const DrawCard = require('../../../drawcard.js');

class Grenn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this)) &&
                    this.opponentHasFactionPower()
            },
            target: {
                activePromptTitle: 'Select attacking character',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card !== this &&
                    this.game.currentChallenge.isAttacking(card) &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character')
            },
            handler: context => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                var power = otherPlayer.faction.power > 1 && context.target.kneeled === false ? 2 : 1;
                this.game.addPower(otherPlayer, -power);
                context.target.modifyPower(power);

                this.game.addMessage('{0} uses {1} to move {2} power from {3}\'s faction to {4}', 
                                      this.controller, this, power, otherPlayer, context.target);
            }
        });
    }

    opponentHasFactionPower() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        return otherPlayer.faction.power > 0;
    }
}

Grenn.code = '07010';

module.exports = Grenn;
