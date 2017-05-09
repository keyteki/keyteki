const DrawCard = require('../../../drawcard.js');

class SmallCouncilChamber extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(card => card.getType() === 'event')
        });
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller && challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
                this.modifyPower(1);
            }
        });
    }
}

SmallCouncilChamber.code = '02110';

module.exports = SmallCouncilChamber;
