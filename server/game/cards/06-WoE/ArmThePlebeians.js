import Card from '../../Card.js';

class ArmThePlebeians extends Card {
    //Play: Make a token creature. Ward it.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                gameAction: ability.actions.ward((context) => ({
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

ArmThePlebeians.id = 'arm-the-plebeians';

export default ArmThePlebeians;
