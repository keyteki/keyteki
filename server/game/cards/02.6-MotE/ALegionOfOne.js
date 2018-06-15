const DrawCard = require('../../drawcard.js');

class ALegionOfOne extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a solitary character +3/+0',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                cardCondition: card => card.controller === this.controller &&
                                       (card.isAttacking() && this.game.currentConflict.attackers.length === 1 ||
                                       card.isDefending() && this.game.currentConflict.defenders.length === 1)
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, giving {2} +3/+0', this.controller, this, context.target);
                let resolveAbility = () => {
                    this.untilEndOfConflict(ability => ({
                        match: context.target,
                        effect: ability.effects.modifyMilitarySkill(3)
                    }));
                };
                resolveAbility();
                if(context.target.fate > 0 && context.target.allowGameAction('removeFate')) {
                    let resolveAgain = () => {
                        this.game.addMessage('{0} removes a fate from {1}, resolving {2} again', this.controller, context.target, this);
                        this.game.raiseEvent('onCardRemoveFate', { card: context.target, fate: 1 });
                        context.dontRaiseCardPlayed = true;
                        this.game.raiseInitiateAbilityEvent({ card: this, context: context }, () => {
                            resolveAbility();
                            if(context.target.fate > 0 && context.target.allowGameAction('removeFate')) {
                                this.game.promptWithHandlerMenu(this.controller, {
                                    activePromptTitle: 'Discard a fate for no effect?',
                                    source: this,
                                    choices: ['Yes', 'No'],
                                    handlers: [() => {
                                        this.game.addMessage('{0} removes a fate from {1} for no effect', this.controller, context.target);
                                        this.game.raiseEvent('onCardRemoveFate', { card: context.target, fate: 1 });
                                    }, () => true]
                                });
                            }
                        });
                    };
                    this.game.promptWithHandlerMenu(this.controller, {
                        activePromptTitle: 'Discard a fate to resolve A Legion of One again?',
                        source: this,
                        choices: ['Yes', 'No'],
                        handlers: [resolveAgain, () => true]
                    });
                }
            }
        });
    }
}

ALegionOfOne.id = 'a-legion-of-one';

module.exports = ALegionOfOne;
