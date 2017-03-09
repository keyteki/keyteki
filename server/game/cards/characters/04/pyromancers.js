const DrawCard = require('../../../drawcard.js');

class Pyromancers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Pyromancers to discard location',
            phase: 'dominance',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardFactionPower(1)
            ],
            handler: context => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a location to discard',
                    source: this,
                    cardCondition: card => card.location === 'play area' && !card.isLimited() && card.getType() === 'location',
                    onSelect: (p, card) => {
                        card.controller.discardCard(card);
                        this.game.addMessage('{0} kneels {1} and discards a power from their faction to discard {2} from play', this.controller, this, card);
                        
                        return true;
                    }
                });
            }
        });
    }
}

Pyromancers.code = '04018';

module.exports = Pyromancers;
