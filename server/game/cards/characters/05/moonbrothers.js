const DrawCard = require('../../../drawcard.js');

class MoonBrothers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add as an attacker',
            location: 'hand',
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.attackingPlayer === this.controller &&
                this.hasAttackingClansman()
            ),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.controller.putIntoPlay(this);
                this.game.currentChallenge.addAttacker(this);
                this.kneeled = false;
                this.game.addMessage('{0} kneels their faction card to put {1} into play participating  as an attacker', 
                                      this.controller, this);
            }
        });
    }

    hasAttackingClansman() {
        var cards = this.controller.filterCardsInPlay(card => {
            return card.hasTrait('Clansman') && card.getType() === 'character' && this.game.currentChallenge.isAttacking(card);
        });

        return cards.length > 0;
    }
}

MoonBrothers.code = '05011';

module.exports = MoonBrothers;
