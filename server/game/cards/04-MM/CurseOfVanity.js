const Card = require('../../Card.js');

class CurseOfVanity extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.exalt()
                }
            }
        });
    }
}

CurseOfVanity.id = 'curse-of-vanity';

module.exports = CurseOfVanity;
