const DrawCard = require('../../../drawcard.js');

class BrothelMadame extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'challenge'
            },
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return false;
                }

                this.game.promptWithMenu(otherPlayer, this, {
                    activePrompt: {
                        menuTitle: 'Pay 1 gold to initiate military challenges this phase?',
                        buttons: [
                            { text: 'Yes', method: 'payOneGold' },
                            { text: 'No', method: 'doNotPay' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    payOneGold(player) {
        if(player.gold < 1) {
            return false;
        }

        this.game.transferGold(this.controller, player, 1);

        this.game.addMessage('{0} uses {1} to make {2} pay 1 gold to be able to initiate {3} challenges this phase', this.controller, this, player, 'military');

        return true;
    }

    doNotPay(player) {
        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotInitiateChallengeType('military')
        }));

        this.game.addMessage('{0} does not pay 1 gold because of {1} and cannot initiate {2} challenges this phase', player, this, 'military');

        return true;
    }
}

BrothelMadame.code = '02029';

module.exports = BrothelMadame;
