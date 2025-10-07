import Card from '../../Card.js';

class InciteViolence extends Card {
    // Play: For the remainder of the turn, each friendly creature gains splash-attack 1.
    setupCardAbilities(ability) {
        this.play({
            effect: 'give each friendly creature splash-attack 1 for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                target: context.player.creaturesInPlay,
                effect: ability.effects.addKeyword({ 'splash-attack': 1 })
            }))
        });
    }
}

InciteViolence.id = 'incite-violence';

export default InciteViolence;
