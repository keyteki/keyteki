const DrawCard = require('../../../drawcard.js');

class Lightbringer extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: card => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardPowerChanged: (event, card, power) => card === this.parent && power > 0 && card.kneeled
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.parent.controller.standCard(this.parent);

                this.game.addMessage('{0} uses {1} to stand {2}', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('baratheon')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Lightbringer.code = '01058';

module.exports = Lightbringer;
