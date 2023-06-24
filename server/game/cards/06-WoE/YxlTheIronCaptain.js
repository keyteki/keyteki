const Card = require('../../Card.js');

class YxlTheIronCaptain extends Card {
    // Play: Each friendly Ironyx creature captures 2A.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make each friendly Ironyx creature capture 2 amber',
            gameAction: ability.actions.capture((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        card.controller === context.source.controller &&
                        card.type === 'creature' &&
                        card.hasTrait('ironyx')
                ),
                amount: 2
            }))
        });
    }
}

YxlTheIronCaptain.id = 'yxl-the-iron-captain';

module.exports = YxlTheIronCaptain;
