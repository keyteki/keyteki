const DrawCard = require('../../drawcard.js');

class SavvyPolitician extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a character',
            when: {
                'onCardHonored': (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                gameAction: ability.actions.honor()
            }
        });
    }
}

SavvyPolitician.id = 'savvy-politician';

module.exports = SavvyPolitician;
