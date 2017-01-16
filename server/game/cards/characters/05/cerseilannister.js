const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, player, card) => this.controller !== player && card.location === 'hand'
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.game.addMessage('{0} gains 1 power on {1} in reaction to a card being discarded from their opponents\'s hand', this.controller, this);
                this.modifyPower(1);
            }
        });
    }

    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(e, challenge) {
        var player = challenge.attackingPlayer;
        if(this.controller !== player || challenge.challengeType !== 'intrigue') {
            return;
        }

        if(!this.isBlank() && challenge.isAttacking(this)) {
            player.standCard(this);
        }
    }
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
