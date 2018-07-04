const ProvinceCard = require('../../provincecard.js');

class BorderFortress extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal a province',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: 'province',
                location: 'province',
                cardCondition: card => card.facedown,
                gameAction: ability.actions.reveal({ chatMessage: true })
            },
            effect: 'reveal {1}\'s facedown province in their {2}',
            effectArgs: context => [context.target.controller, context.target.location]
        });
    }
}

BorderFortress.id = 'border-fortress'; // This is a guess at what the id might be - please check it!!!

module.exports = BorderFortress;
