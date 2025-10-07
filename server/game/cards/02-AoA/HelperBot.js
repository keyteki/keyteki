import Card from '../../Card.js';

class HelperBot extends Card {
    // Play: You may play one non-Logos card this turn.
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow them to play one non-Logos card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse('logos')
            })
        });
    }
}

HelperBot.id = 'helper-bot';

export default HelperBot;
