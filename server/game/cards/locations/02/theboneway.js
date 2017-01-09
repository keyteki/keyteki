const DrawCard = require('../../../drawcard.js');

class TheBoneway extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller
            },
            handler: () => {
                this.addToken('vengeance', 1);

                this.game.addMessage('{0} uses {1} to add 1 vengeance token to {1}', this.controller, this);
            }
        });

        this.action({
            title: 'Kneel this card to discard 6 vengeance tokens',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.kneeled || this.location !== 'play area' || this.tokens['vengeance'] < 6) {
            return false;
        }

        this.game.addPower(player, 3);
        this.addToken('vengeance', -6);

        this.game.addMessage('{0} uses {1} to discard 6 vengeance tokens and gain 3 power for their faction', this.controller, this);
    }    
}

TheBoneway.code = '02056';

module.exports = TheBoneway;
