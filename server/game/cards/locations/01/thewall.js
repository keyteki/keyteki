const DrawCard = require('../../../drawcard.js');

class TheWall extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onEndChallengePhase', 'onUnopposedWin']);
    }

    play(player) {
        super.play(player);

        player.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier++;
            }
        });
    }

    onCardPlayed(e, player, card) {
        if(this.controller !== player) {
            return;
        }

        if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
            card.strengthModifier++;
        }
    }

    onUnopposedWin(e, challenge) {
        if(this.controller !== challenge.winner && !this.kneeled) {
            this.game.addMessage('{0} is forced to kneel {1} because they lost an unopposed challenge', this.controller, this);
            this.kneeled = true;
        }
    }

    onEndChallengePhase() {
        if(this.kneeled) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Kneel ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'kneel' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    kneel(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} kneels {1} to gain 2 power for their faction', player, this);

        this.game.addPower(player, 2);

        return true;
    }

    cancel(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }

    leavesPlay() {
        super.leavesPlay();

        this.controller.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier--;
            }
        });
    }
}

TheWall.code = '01137';

module.exports = TheWall;
