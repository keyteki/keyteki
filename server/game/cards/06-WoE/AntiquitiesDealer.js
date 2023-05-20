const Card = require('../../Card.js');

class AntiquitiesDealer extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    context.player.cardsInPlay.filter((card) => card.type === 'artifact').length < 1
                        ? 0
                        : 2
            }))
        });
    }
}

AntiquitiesDealer.id = 'antiquities-dealer';

module.exports = AntiquitiesDealer;
