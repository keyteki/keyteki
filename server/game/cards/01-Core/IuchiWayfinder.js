const DrawCard = require('../../drawcard.js');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'look at a province',
            gameAction: ability.actions.lookAt({
                chatMessage: true,
                promptForSelect: {
                    activePromptTitle: 'Choose a province to look at',
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
