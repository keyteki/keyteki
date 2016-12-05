const BaseStep = require('../basestep.js');
const SimpleStep = require('../simplestep.js');
const KillCharacterPrompt = require('../killcharacterprompt.js');

class FulfillMilitaryClaim extends BaseStep {
    constructor(game, player, claim) {
        super(game);
        this.player = player;
        this.claim = claim;
    }

    continue() {
        if(this.claim > 0) {
            this.game.queueStep(this.createKillPrompt());
            return false;
        }

        // TODO: Temporary to resume game flow.
        this.game.queueStep(new SimpleStep(this.game, () => {
            this.player.doneClaim();

            var otherPlayer = this.game.getOtherPlayer(this.player);

            if(otherPlayer) {
                this.game.promptForChallenge(otherPlayer);
            }
        }));

        return true;
    }

    createKillPrompt() {
        var events = {
            onKill: () => this.fulfillClaim(),
            onCancel: () => this.cancelClaim()
        };
        return new KillCharacterPrompt(this.game, this.player, card => this.allowedToKill(card), events);
    }

    allowedToKill(card) {
        return card.owner === this.player;
    }

    fulfillClaim() {
        this.claim -= 1;
    }

    cancelClaim() {
        this.claim = 0;
        this.game.addMessage('{0} has cancelled claim effects', this.player);
    }
}

module.exports = FulfillMilitaryClaim;
