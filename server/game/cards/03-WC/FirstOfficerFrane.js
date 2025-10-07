import Card from '../../Card.js';

class FirstOfficerFrane extends Card {
    // Play/Fight/Reap: A friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

FirstOfficerFrane.id = 'first-officer-frane';

export default FirstOfficerFrane;
