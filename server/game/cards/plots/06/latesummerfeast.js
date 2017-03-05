const PlotCard = require('../../../plotcard.js');

class LateSummerFeast extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                if(!otherPlayer) {
                    return;
                }

                this.game.addMessage('{0} is forced by {1} to allow {2} to draw 1 card', this.controller, this, otherPlayer);
                this.game.promptWithMenu(otherPlayer, this, {
                    activePrompt: {
                        menuTitle: 'Draw 1 card from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'draw' },
                            { text: 'No', method: 'pass' }
                        ]
                    },
                    source: this
                }); 
            }
        });
    }

    draw(otherPlayer) {
        otherPlayer.drawCardsToHand(1);
        this.game.addMessage('{0} draws 1 card', otherPlayer);

        return true;
    }

    pass(otherPlayer) {
        this.game.addMessage('{0} declines to draw 1 card', otherPlayer);

        return true;
    }
}

LateSummerFeast.code = '06020';

module.exports = LateSummerFeast;
