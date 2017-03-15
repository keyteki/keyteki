const DrawCard = require('../../../drawcard.js');

class BearIslandHost extends DrawCard {
    setupCardAbilities(ability) {  
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a House Mormont character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.hasTrait('House Mormont') && card.getType() === 'character',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.untilEndOfPhase(ability => ({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military'),
            match: card,
            effect: ability.effects.doesNotKneelAsAttacker()
        }));

        this.game.addMessage('{0} discards a gold from {1} to make {2} not kneel as an attacker in a military challenge', 
                              player, this, card);

        return true;
    }
}

BearIslandHost.code = '06021';

module.exports = BearIslandHost;
