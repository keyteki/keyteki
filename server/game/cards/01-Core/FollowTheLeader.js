const Card = require('../../Card.js');

class FollowTheLeader extends Card {
    // Play: For the remainder of the turn, each friendly creature may fight.
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
