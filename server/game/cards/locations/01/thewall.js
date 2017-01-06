const DrawCard = require('../../../drawcard.js');

class TheWall extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed']);
    }

    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onUnopposedWin: (e, challenge) => this.controller !== challenge.winner && !this.kneeled
            },
            handler: () => {
                this.game.addMessage('{0} is forced to kneel {1} because they lost an unopposed challenge', this.controller, this);
                this.controller.kneelCard(this);
            }
        });
        this.interrupt({
            when: {
                onPhaseEnded: (e, phase) => phase === 'challenge'
            },
            handler: () => {
                this.controller.kneelCard(this);
                this.game.addPower(this.controller, 2);
                this.game.addMessage('{0} kneels {1} to gain 2 power for their faction', this.controller, this);
            }
        });
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

    leavesPlay() {
        super.leavesPlay();

        if(this.isBlank()) {
            return;
        }

        this.controller.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier--;
            }
        });
    }
}

TheWall.code = '01137';

module.exports = TheWall;
