const DrawCard = require('../../drawcard.js');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal a province',
            when: {
                onCardEntersPlay: event => event.card === this
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
