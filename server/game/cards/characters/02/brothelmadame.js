const DrawCard = require('../../../drawcard.js');

// XXX Restrict to one effect per card title (ie multiple madames should not trigger)
class BrothelMadame extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onGoldTransferred']);
    }

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

                this.hasPaidGoldThisPhase = false;

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

                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'opponent',
                    condition: () => !this.hasPaidGoldThisPhase,
                    effect: ability.effects.cannotInitiateChallengeType('military')
                }));
            }
        });
    }

    onGoldTransferred(event) {
        if(event.target !== this.controller || event.amount <= 0) {
            return false;
        }

        if(this.hasPaidGoldThisPhase) {
            return true;
        }

        this.hasPaidGoldThisPhase = true;
        this.game.addMessage('{0} has now paid {1} and can initiate {2} challenges this phase', event.source, event.target, 'military');
    }

    payOneGold(player) {
        if(player.gold < 1) {
            return false;
        }

        this.game.transferGold(this.controller, player, 1);

        this.game.addMessage('{0} uses {1} to make {2} pay 1 gold', this.controller, this, player);

        return true;
    }
}

BrothelMadame.code = '02029';

module.exports = BrothelMadame;
