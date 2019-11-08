const Card = require('../../Card.js');

class FollowTheLeader extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow each friendly creature to fight until the end of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canFight(() => true)
            })
        });
    }
}

FollowTheLeader.id = 'follow-the-leader';

module.exports = FollowTheLeader;
