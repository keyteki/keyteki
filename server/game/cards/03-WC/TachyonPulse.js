const Card = require('../../Card.js');

class TachyonPulse extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each artifact and exhaust each creature with an upgrade',
            gameAction: [
                ability.actions.destroy(context => ({
                    target: context.game.cardsInPlay.filter(card => card.type === 'artifact')
                })),
                ability.actions.gainAmber(context => ({
                    amount: context.player.creaturesInPlay.filter(card => card.hasHouse('dis')).length
                })),
                ability.actions.gainAmber(context => ({
                    target: context.player.opponent,
                    amount: context.player.opponent ? context.player.opponent.creaturesInPlay.filter(card => card.hasHouse('dis')).length : 0
                }))
            ]
        });
    }
}

TachyonPulse.id = 'tachyon-pulse';

module.exports = TachyonPulse;
