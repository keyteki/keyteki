const Card = require('../../Card.js');

class DoomSigil extends Card {
    // Each creature gains poison.
    // If there are no creatures in play, destroy Doom Sigil.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.addKeyword({ poison: 1 })
        });

        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) => context.game.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no creatures in play',
                gameAction: ability.actions.destroy()
            })
        });
    }
}

DoomSigil.id = 'doom-sigil';

module.exports = DoomSigil;
