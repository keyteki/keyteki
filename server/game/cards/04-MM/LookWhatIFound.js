const Card = require('../../Card.js');

class LookWhatIFound extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    cardType: 'action',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                },
                artifact: {
                    cardType: 'artifact',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                },
                creature: {
                    cardType: 'creature',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                },
                upgrade: {
                    cardType: 'upgrade',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                }
            }
        });
    }
}

LookWhatIFound.id = 'look-what-i-found';

module.exports = LookWhatIFound;
