const Card = require('../../Card.js');

class ProfessorSutterkin extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw((context) => ({
                amount: context.player.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.hasHouse('logos')
                ).length
            }))
        });
    }
}

ProfessorSutterkin.id = 'professor-sutterkin';

module.exports = ProfessorSutterkin;
