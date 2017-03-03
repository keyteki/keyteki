const DrawCard = require('../../../drawcard.js');

class FickleBannerman extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (e, challenge) => challenge.loser === this.controller && challenge.challengeType === 'power'
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard a gold from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardGold' },
                            { text: 'No', method: 'loseControl' }
                        ]
                    },
                    source: this
                });                
            }
        });
    }

    discardGold() {
        this.removeToken('gold', 1);
        this.game.addMessage('{0} is forced to discard a gold from {1}', this.controller, this);

        return true;
    }

    loseControl() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        this.game.takeControl(otherPlayer, this);
        this.game.addMessage('{0} takes control of {1}', otherPlayer, this);

        return true;
    }
}

FickleBannerman.code = '06007';

module.exports = FickleBannerman;
