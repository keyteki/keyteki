const DrawCard = require('../../../drawcard.js');

class VenomousBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to poison',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.getStrength() <= 2),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.poison
        }));

        return true;
    }

    canAttach(player, card) {
        if(!card.isFaction('martell') || card.controller !== this.controller) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

VenomousBlade.code = '04036';

module.exports = VenomousBlade;
