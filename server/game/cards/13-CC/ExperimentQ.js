import Card from '../../Card.js';

class ExperimentQ extends Card {
    // Enhance .
    // Experiment Q gets +1 power for each Mars creature in play.
    // Play: For each Mars creature in play, stun a non-Mars creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                (card, context) =>
                    context.game.creaturesInPlay.filter((c) => c.hasHouse('mars')).length
            )
        });

        this.play({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars')).length,
                action: ability.actions.stun({
                    promptForSelect: {
                        activePromptTitle: 'Choose a non-Mars creature to stun',
                        cardType: 'creature',
                        cardCondition: (card) => !card.hasHouse('mars')
                    }
                })
            }))
        });
    }
}

ExperimentQ.id = 'experiment-q';

export default ExperimentQ;
