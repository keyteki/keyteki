const Card = require('../../Card.js');

class Tangaika extends Card {
    // You cannot play Tanagaika unless you control 4 or more
    // Cultists.
    //
    // Splash-attack 5.
    //
    // After Fight: Gain 1 Aember.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot(
                'play',
                (context) =>
                    context.player.creaturesInPlay.filter((card) => card.name === 'Cultist')
                        .length < 4
            )
        });

        this.fight({
            gameAction: ability.actions.gainAmber()
        });
    }
}

Tangaika.id = 'tangaika';

module.exports = Tangaika;
