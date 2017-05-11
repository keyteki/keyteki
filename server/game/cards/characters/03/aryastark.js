const DrawCard = require('../../../drawcard.js');

class AryaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event => (
                    this.controller === event.card.controller &&
                    event.card.isFaction('stark'))
            },
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.getStrength() <= 3),
                    activePromptTitle: 'Select a character',
                    source: this,
                    gameAction: 'kill',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);
        this.game.addMessage('{0} sacrifices {1} to kill {2}', player, this, card);

        return true;
    }
}

AryaStark.code = '03007';

module.exports = AryaStark;
