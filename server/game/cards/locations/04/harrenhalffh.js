const DrawCard = require('../../../drawcard.js');

class Harrenhal extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Harrenhal to put a character in play',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge',
            handler: context => {
                this.game.promptForSelect(context.player, {
                    cardCondition: card => (
                        card.location === 'hand' && 
                        card.getType() === 'character' && 
                        card.controller === this.controller &&
                        (card.isFaction('lannister') || card.hasTrait('House Bolton'))),
                    activePromptTitle: 'Select a character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);

        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.killIfStillInPlay(false)
        }));

        this.game.addMessage('{0} kneels {1} to put {2} into play from their hand', player, this, card);

        return true;        
    }
}

Harrenhal.code = '04050';

module.exports = Harrenhal;
