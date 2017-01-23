const DrawCard = require('../../../drawcard.js');

class Jhogo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getNumberOfBloodriders() >= 1,
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getNumberOfDeadDefendingCharacters())
        });
    }

    getNumberOfBloodriders() {
        var cards = this.controller.cardsInPlay.reduce((runningTotal, card) => {
            if(!this.isBlank() && card.hasTrait('Bloodrider') && card.getType() === 'character' && card !== this) {
                return runningTotal + 1;
            }

            return runningTotal;
        }, 0);

        return cards;
    }

    getNumberOfDeadDefendingCharacters() {
        var deadDefenders = [];
        this.game.currentChallenge.defendingPlayer.deadPile.each(card => {
            if(card.isUnique() && !deadDefenders.includes(card.name)) {
                deadDefenders.push(card.name);
            } else if(!card.isUnique()) {
                deadDefenders.push(card.name);
            }
        });

        return deadDefenders.length;
    }
}

Jhogo.code = '02113';

module.exports = Jhogo;
