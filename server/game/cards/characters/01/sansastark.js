const DrawCard = require('../../../drawcard.js');

class SansaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }

    onCardEntersPlay(event) {
        if(event.card !== this || this.controller.phase === 'setup') {
            return;
        }

        this.controller.kneelCard(this);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (e, player, card) => {
                    return card === this;
                }
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.addPower(this.controller, 1);

                this.game.addMessage('{0} uses {1} to gain 1 power for their faction', this.controller, this);
            }
        });
    }
}

SansaStark.code = '01147';

module.exports = SansaStark;
