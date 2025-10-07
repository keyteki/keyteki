import Card from '../../Card.js';

class CensorPhiloEvilTwin extends Card {
    // Play: Deal 5D to a creature with A on it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.dealDamage({ amount: 5 })
            }
        });
    }
}

CensorPhiloEvilTwin.id = 'censor-philo-evil-twin';

export default CensorPhiloEvilTwin;
