const DrawCard = require('../../../drawcard.js');

class GreatKraken extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed']);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUnopposedWin: (event, challenge) => this.controller === challenge.winner
            },
            limit: ability.limit.perRound(2),
            choices: {
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                },
                'Gain 1 power': () => {
                    this.game.addPower(this.controller, 1);
                    this.game.addMessage('{0} uses {1} to gain 1 power for their faction', this.controller, this);
                }
            }
        });
    }

    onCardPlayed(event, player, card) {
        if(this.controller !== player) {
            return;
        }

        if(card.name === 'Balon Greyjoy') {
            card.addKeyword('stealth');
        }
    }

    leavesPlay() {
        super.leavesPlay();

        var balonGreyjoy = this.controller.findCardByName(this.controller.cardsInPlay, 'Balon Greyjoy');

        if(balonGreyjoy) {
            balonGreyjoy.removeKeyword('stealth');
        }
    }
}

GreatKraken.code = '01078';

module.exports = GreatKraken;
