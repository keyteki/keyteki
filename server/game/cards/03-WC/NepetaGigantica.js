const Card = require('../../Card.js');

class NepetaGigantica extends Card {
    setupCardAbilities(ability) {
        this.action({
            targets: {
                select: {
                    mode: 'select',
                    activePromptTitle: 'Stun a',
                    choices: {
                        '5 or higher power creature': () => true,
                        'Giant creature': () => true
                    }
                },
                cards: {
                    dependsOn: 'select',
                    mode: 'exactly',
                    numCards: 1,
                    cardCondition: (card, context) => context.selects.select.choice === '5 or higher power creature' ? card.power >= 5 : card.hasTrait('giant'),
                    location: 'play area',
                    gameAction: ability.actions.stun()
                }
            }
        });
    }
}

NepetaGigantica.id = 'nepeta-gigantica';

module.exports = NepetaGigantica;
