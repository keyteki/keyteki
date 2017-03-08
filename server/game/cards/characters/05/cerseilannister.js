const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue'
            ),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
        this.reaction({
            when: {
                onCardsDiscarded: event => (
                    this.controller !== event.player &&
                    event.originalLocation === 'hand'
                )
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.game.addMessage('{0} gains 1 power on {1} in reaction to a card being discarded from their opponents\'s hand', this.controller, this);
                this.modifyPower(1);
            }
        });
    }
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
