const DrawCard = require('../../../drawcard.js');

class Summer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Bran Stark',
            effect: ability.effects.addKeyword('Insight')
        });

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: (card) => this.cardCondition(card),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    cardCondition(card) {
        return (card.location === 'dead pile' || card.location === 'discard pile') && card.controller === this.controller && card.getType() === 'character' &&
            card.isFaction('stark') && card.getStrength(true) <= 2;
    }

    onCardSelected(player, card) {
        var oldLocation = card.location;

        player.moveCard(card, 'hand');

        this.game.addMessage('{0} uses {1} to move {2} from their {3} to their hand', player, this, card, oldLocation);

        return true;
    }
}

Summer.code = '01148';

module.exports = Summer;
