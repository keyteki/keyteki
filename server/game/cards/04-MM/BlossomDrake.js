const Card = require('../../Card.js');

class BlossomDrake extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                () => this.game.cardsInPlay.filter((card) => card.type === 'artifact').length
            )
        });

        this.persistentEffect({
            match: (card) => card.type === 'artifact',
            targetController: 'any',
            effect: ability.effects.blank()
        });
    }
}

BlossomDrake.id = 'blossom-drake';

module.exports = BlossomDrake;
