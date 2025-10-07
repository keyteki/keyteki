import Card from '../../Card.js';

class Umwas extends Card {
    // Play: Make a token creature. Give each friendly token creature
    // a +1 power counter.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to add 1 power counter to each friendly token creature',
                gameAction: ability.actions.addPowerCounter((context) => ({
                    target: context.player.creaturesInPlay.filter((card) => card.isToken())
                }))
            }
        });
    }
}

Umwas.id = 'umwas';

export default Umwas;
