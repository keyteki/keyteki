const Card = require('../../Card.js');

class ExoShellSystem extends Card {
    // Play: Make a token creature.
    //
    // Each friendly token creature gains elusive.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.persistentEffect({
            match: (card) => card.isToken(),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

ExoShellSystem.id = 'exo-shell-system';

module.exports = ExoShellSystem;
