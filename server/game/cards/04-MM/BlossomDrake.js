const Card = require('../../Card.js');

class BlossomDrake extends Card {
    // Blossom Drake gets +1 power for each artifact in play.
    // Each artifacts text box is considered blank (except for traits).
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
