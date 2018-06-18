const DrawCard = require('../../drawcard.js');

class VengefulBerserker extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Double military skill',
            when: {
                onCardLeavesPlay: (event, context) => {
                    let card = event.cardStateWhenLeftPlay;
                    return card.type === 'character' && card.controller === context.player && this.game.isDuringConflict();
                }
            },
            effect: 'double his military skill until the end of the conflict',
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyMilitarySkillMultiplier(2) })
        });
    }
}

VengefulBerserker.id = 'vengeful-berserker';

module.exports = VengefulBerserker;
