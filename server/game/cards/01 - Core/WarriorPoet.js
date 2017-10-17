const DrawCard = require('../../drawcard.js');

class WarriorPoet extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce skill of opponent\'s characters',
            condition: () => this.isParticipating(),
            handler: () => {
                this.game.addMessage('{0} uses {1} to reduce the skill of all {2}\'s characters', this.controller, this, this.game.getOtherPlayer(this.controller));
                this.untilEndOfConflict(ability => ({
                    match: card => (
                        card.getType() === 'character' && this.game.currentConflict.isParticipating(card)
                    ),
                    targetController: 'opponent',
                    effect: [
                        ability.effects.modifyPoliticalSkill(-1),
                        ability.effects.modifyMilitarySkill(-1)
                    ]
                }));
            }
        });
    }
}

WarriorPoet.id = 'warrior-poet';

module.exports = WarriorPoet;
