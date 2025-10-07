import Card from '../../Card.js';

class TalmageSteelheart extends Card {
    // Play: Give Talmage Steelheart a +1 power counter for each card you have played this turn (including this one).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addPowerCounter((context) => ({
                amount: context.game.cardsPlayed.length
            }))
        });
    }
}

TalmageSteelheart.id = 'talmage-steelheart';

export default TalmageSteelheart;
