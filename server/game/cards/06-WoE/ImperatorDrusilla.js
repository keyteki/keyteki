const Card = require('../../Card.js');

class ImperatorDrusilla extends Card {
    // Play: Destroy another friendly creature.
    //
    // While there are more enemy creatures than friendly creatures,
    // Imperator Drusilla gains splash-attack 4.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card !== this,
                gameAction: ability.actions.destroy()
            }
        });

        this.persistentEffect({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length,
            effect: ability.effects.addKeyword({
                'splash-attack': 4
            })
        });
    }
}

ImperatorDrusilla.id = 'imperator-drusilla';

module.exports = ImperatorDrusilla;
