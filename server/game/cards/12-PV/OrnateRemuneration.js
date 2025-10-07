import Card from '../../Card.js';

class OrnateRemuneration extends Card {
    // Play: Choose one:
    // Move each A from a friendly creature to your pool.
    // A friendly creature captures 3A.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Move amber': () => true,
                        'Capture 3': () => true
                    }
                },
                'Move amber': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.returnAmber((context) => ({
                        all: true,
                        recipient: context.player
                    }))
                },
                'Capture 3': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.capture({ amount: 3 })
                }
            }
        });
    }
}

OrnateRemuneration.id = 'ornate-remuneration';

export default OrnateRemuneration;
