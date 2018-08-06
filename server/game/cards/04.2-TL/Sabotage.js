const DrawCard = require('../../drawcard.js');

class Sabotage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.isDuringConflict('military'),
            title: 'Discard a card in a province',
            target: {
                location: 'province',
                controller: 'opponent',
                cardType: ['character','holding'],
                gameAction: ability.actions.discardCard()
            }
        });
    }
}
Sabotage.id = 'sabotage';

module.exports = Sabotage;
