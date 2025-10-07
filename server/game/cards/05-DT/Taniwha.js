import Card from '../../Card.js';

class Taniwha extends Card {
    // Fight/Reap: Destroy a friendly creature and gain 1A.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

Taniwha.id = 'taniwha';

export default Taniwha;
