const DrawCard = require('../../drawcard.js');

class FawningDiplomat extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.interrupt({
            title: 'Claim Imperial favor',
            when: {
                onCardLeavesPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Which side of the Imperial Favor would you like to claim?',
                        buttons: [
                            { text: 'Military', method: 'giveImperialFavorToPlayer', arg: 'military' },
                            { text: 'Political', method: 'giveImperialFavorToPlayer', arg: 'political' }
                        ]
                    }
                });
            }
        });
    }

    giveImperialFavorToPlayer(arg) {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        this.controller.claimImperialFavor(arg);
        if(otherPlayer) {
            otherPlayer.loseImperialFavor();
            this.game.addMessage('{0} succesfully claims the Emperor\'s {1} favor with total glory of {2} vs {3}', this.controller, arg, this.controller.totalGloryForFavor, otherPlayer.totalGloryForFavor);
        }
        return true;
    }
}

FawningDiplomat.id = 'fawning-diplomat';

module.exports = FawningDiplomat;
