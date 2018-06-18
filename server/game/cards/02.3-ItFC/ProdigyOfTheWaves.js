const DrawCard = require('../../drawcard.js');

class ProdigyOfTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready this character',
            condition: () => this.game.rings['water'].isConsideredClaimed(),
            gameAction: ability.actions.ready()
        });
    }
}

ProdigyOfTheWaves.id = 'prodigy-of-the-waves';

module.exports = ProdigyOfTheWaves;
