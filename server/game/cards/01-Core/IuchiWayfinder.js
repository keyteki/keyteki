const DrawCard = require('../../drawcard.js');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Reveal a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'reveal a province',
            gameAction: ability.actions.lookAt({
                chatMessage: true,
                promptForSelect: {
                    activePromptTitle: 'Choose a province to reveal',
                    cardType: 'province',
                    location: 'province',
                    controller: 'opponent'
                }
            })
        });
    }
}

IuchiWayfinder.id = 'iuchi-wayfinder';

module.exports = IuchiWayfinder;
