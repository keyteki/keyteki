const DrawCard = require('../../drawcard.js');

class IkomaProdigy extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.fate > 0,
                onMoveFate: (event, context) => event.recipient === context.source && event.fate > 0
            },
            gameAction: ability.actions.gainHonor()
        });
    }
}

IkomaProdigy.id = 'ikoma-prodigy';

module.exports = IkomaProdigy;
