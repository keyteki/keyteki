const DrawCard = require('../../drawcard.js');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal a province',
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source && 
                                                      this.game.allCards.any(card => card.isProvince && card.controller === context.player.opponent)
            },
            handler: () => this.game.promptForSelect(this.controller, {
                source: this,
                activePromptTitle: 'Choose a province to reveal',
                cardType: 'province',
                cardCondition: card => card.facedown,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}\'s ability to reveal {2}', player, this, card);
                    return true;
                }
            })
        });
    }
}

IuchiWayfinder.id = 'iuchi-wayfinder';

module.exports = IuchiWayfinder;
