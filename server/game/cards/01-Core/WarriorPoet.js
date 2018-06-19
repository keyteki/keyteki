const DrawCard = require('../../drawcard.js');

class WarriorPoet extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce skill of opponent\'s characters',
            condition: context => context.source.isParticipating(),
            effect: 'reduce the skill of all opposing characters',
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent),
                effect: ability.effects.modifyBothSkills(-1)
            }))
        });
    }
}

WarriorPoet.id = 'warrior-poet';

module.exports = WarriorPoet;
