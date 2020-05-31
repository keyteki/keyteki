const Card = require('../../Card.js');

class PsionicOfficerLang extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.archive((context) => ({
                target:
                    context.source.controller.deck.length > 0
                        ? context.source.controller.deck[0]
                        : []
            }))
        });
    }
}

PsionicOfficerLang.id = 'psionic-officer-lang';

module.exports = PsionicOfficerLang;
