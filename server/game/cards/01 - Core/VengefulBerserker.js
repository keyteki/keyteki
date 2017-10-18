const DrawCard = require('../../drawcard.js');

class VengefulBerserker extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Double military skill',
            when: {
                onCardLeavesPlay: event => event.card.type === 'character' && event.card.controller === this.controller && this.game.currentConflict
            },
            handler: () => {
                this.game.addMessage('{0} uses {1}\'s ability to double his military skill until the end of the conflict', this.controller, this);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: ability.effects.modifyMilitarySkillMultiplier(2)
                }));
            }
        });
    }
}

VengefulBerserker.id = 'vengeful-berserker';

module.exports = VengefulBerserker;
