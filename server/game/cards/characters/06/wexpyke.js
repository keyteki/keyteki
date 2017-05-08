const DrawCard = require('../../../drawcard.js');

class WexPyke extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: card => card.getType() === 'character' && card.getCost() === this.tokens['gold'],
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });

        this.action({
            title: 'Move gold to ' + this.name,
            condition: () => this.controller.gold >= 1,
            phase: 'dominance',
            limit: ability.limit.perPhase(2),
            handler: context => {
                this.game.addGold(this.controller, -1);
                this.addToken('gold', 1);
                this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', context.player, this);
            }
        });
    }
}

WexPyke.code = '06031';

module.exports = WexPyke;
