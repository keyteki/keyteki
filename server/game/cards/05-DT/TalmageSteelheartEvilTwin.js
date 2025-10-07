import Card from '../../Card.js';

class TalmageSteelheartEvilTwin extends Card {
    // Play: Deal damage to an enemy creature equal to the number of cards you have played this turn (including this one).
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.game.cardsPlayed.length
                }))
            }
        });
    }
}

TalmageSteelheartEvilTwin.id = 'talmage-steelheart-evil-twin';

export default TalmageSteelheartEvilTwin;
