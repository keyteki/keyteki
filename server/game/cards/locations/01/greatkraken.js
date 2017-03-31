const DrawCard = require('../../../drawcard.js');

class GreatKraken extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Balon Greyjoy',
            effect: ability.effects.addKeyword('stealth')
        });
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => this.controller === challenge.winner && challenge.isUnopposed()
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
}

GreatKraken.code = '01078';

module.exports = GreatKraken;
