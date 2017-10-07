const DrawCard = require('../../drawcard.js');

class Banzai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.currentConflict,
            max: ability.limit.perConflict(1),
            clickToActivate: true,
            target: {
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to grant 2 military skill to {2}', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyMilitarySkill(2)
                }));
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Select one',
                    source: this,
                    choices: ['Lose 1 honor to resolve this ability again', 'Done'],
                    handlers: [
                        () => {
                            this.game.addHonor(this.controller, -1);
                            this.game.promptForSelect(this.controller, {
                                cardType: 'character',
                                cardCondition: card => this.game.currentConflict.isParticipating(card),
                                onSelect: (player, card) => {
                                    this.game.addMessage('{0} loses 1 honor resolve {1} again, granting 2 military skill to {2}', player, this, card);
                                    this.game.raiseEvent('onCardAbilityInitiated', { player: player, source: this }, () => {
                                        this.untilEndOfConflict(ability => ({
                                            match: card,
                                            effect: ability.effects.modifyMilitarySkill(2)
                                        }));
                                    });
                                    return true;
                                }
                            });
                        },
                        () => true
                    ]
                });
            }
        });
    }
}

Banzai.id = 'banzai';

module.exports = Banzai;
