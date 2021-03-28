const Card = require('../../Card.js');

class SongOfTheWild extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                "give each friendly creature 'Reap: Gain 1 amber' for the remainder of the turn",
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.player.creaturesInPlay,
                effect: ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.gainAmber()
                })
            }))
        });
    }
}

SongOfTheWild.id = 'song-of-the-wild';

module.exports = SongOfTheWild;
