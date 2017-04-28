const DrawCard = require('../../../drawcard.js');

class ChellaDaughterOfCheyk extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['ear'])
        });

        this.persistentEffect({
            condition: () => this.tokens['ear'] >= 3,
            match: this,
            effect: [
                ability.effects.addKeyword('Intimidate'),
                ability.effects.addKeyword('Renown')
            ]
        });

        this.reaction({
            when: {
                onCharacterKilled: event => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this) && event.card !== this
            },
            handler: () => {
                this.addToken('ear', 1);
                this.game.addMessage('{0} uses {1} to add 1 ear token to {1}', this.controller, this);
            }
        });
    }
}

ChellaDaughterOfCheyk.code = '05007';

module.exports = ChellaDaughterOfCheyk;
