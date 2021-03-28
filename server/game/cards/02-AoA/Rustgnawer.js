const Card = require('../../Card.js');

class Rustgnawer extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            then: (context) => ({
                gameAction: [
                    ability.actions.gainAmber({
                        amount: context.target.bonusIcons.filter((icon) => icon === 'amber').length
                    })
                ]
            })
        });
    }
}

Rustgnawer.id = 'rustgnawer';

module.exports = Rustgnawer;
