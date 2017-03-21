const DrawCard = require('../../../drawcard.js');

class SerJaimeLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackers.length === 1,
            match: card => card.hasTrait('Knight') && this.game.currentChallenge.isAttacking(card),
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Give an intrigue icon to a character',
            method: 'addIcon',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select character',
                cardCondition: card => this.isKingsguardCharacter(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to give {2} an {3} icon', context.player, this, context.target, 'intrigue');
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addIcon('intrigue')
                }));
            }
        });
    }

    isKingsguardCharacter(card) {
        return card.location === 'play area' && card.hasTrait('Kingsguard') && card.getType() === 'character';
    }
}

SerJaimeLannister.code = '05005';

module.exports = SerJaimeLannister;
