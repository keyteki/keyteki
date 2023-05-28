const Card = require('../../Card.js');

class CloneHome extends Card {
    // Play: Make a token creature. If there are more friendly
    // creatures than enemy creatures, archive Clone Home.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.creaturesInPlay.length >
                        context.player.opponent.creaturesInPlay.length,
                    trueGameAction: ability.actions.archive((context) => ({
                        target: context.source
                    }))
                })
            ]
        });
    }
}

CloneHome.id = 'clone-home';

module.exports = CloneHome;
