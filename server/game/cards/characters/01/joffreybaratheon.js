const DrawCard = require('../../../drawcard.js');

class JoffreyBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, player, card) => card.getType() === 'character' && (card.hasTrait('Lord') || card.hasTrait('Lady'))
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.game.addMessage('{0} gains 1 power from a Lord or Lady being killed', this.controller);

                this.modifyPower(1);
            }
        });
    }
}

JoffreyBaratheon.code = '01086';

module.exports = JoffreyBaratheon;
