const DrawCard = require('../../../drawcard.js');

class TheValyrian extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to give attacking character +STR',
            condition: this.game.currentChallenge && this.game.currentChallenge.defendingPlayer.gold >= 1 && this.game.currentChallenge.attackers.length >= 1,
            cost: ability.costs.kneelSelf(),
            handler: context => {
                var boost = this.game.currentChallenge.defendingPlayer.gold;

                this.game.promptForSelect(context.player, {
                    cardCondition: card => this.game.currentChallenge.isAttacking(card),
                    activePromptTitle: 'Select character to gain strength',
                    source: this,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge', player, this, card, boost);
                        this.untilEndOfChallenge(ability => ({
                            match: card,
                            effect: ability.effects.modifyStrength(boost)
                        }));

                        return true;
                    }
                });
            }
        });
    }
}

TheValyrian.code = '04108';

module.exports = TheValyrian;
