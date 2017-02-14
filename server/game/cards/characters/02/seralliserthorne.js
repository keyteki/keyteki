const DrawCard = require('../../../drawcard.js');

class SerAlliserThorne extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.defendingPlayer === this.controller,
            match: card => card.getType() === 'character' && card.getFaction() === this.getFaction(),
            effect: ability.effects.addIcon('military')
        });
        // TODO: Military ambush ability
    }
}

SerAlliserThorne.code = '02045';

module.exports = SerAlliserThorne;
