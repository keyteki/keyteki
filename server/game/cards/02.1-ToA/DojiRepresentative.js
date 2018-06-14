const DrawCard = require('../../drawcard.js');

class DojiRepresentative extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character home',
            gameAction: ability.actions.sendHome()
        });
    }
}

DojiRepresentative.id = 'doji-representative';

module.exports = DojiRepresentative;
