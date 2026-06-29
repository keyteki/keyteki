const Card = require('../../Card.js');

class Rustgnawer extends Card {
    // Fight: Destroy an artifact. If that artifact had an mber bonus, you gain that much A.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            then: (context) => ({
                condition: () => !!context.target,
                gameAction: [
                    ability.actions.gainAmber({
                        amount: context.target
                            ? context.target.bonusIcons.filter((icon) => icon === 'amber').length
                            : 0
                    })
                ]
            })
        });
    }
}

Rustgnawer.id = 'rustgnawer';

module.exports = Rustgnawer;
