const DrawCard = require('../../drawcard.js');

class GuardDuty extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: context => context.source.parent.isDefending(),
            gameAction: ability.actions.honor(context => ({ target: context.source.parent }))
        });
    }
}

GuardDuty.id = 'guard-duty';

module.exports = GuardDuty;
