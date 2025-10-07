import GiganticCard from '../../GiganticCard.js';

class Bawretchadontius extends GiganticCard {
    // (Play only with the other half of Bawretchadontius.)
    // Each friendly creature with A on it gains, ”After Reap: Deal 4D to a
    // creature.”
    // Play/After Fight/After Reap: Exalt a friendly creature and 2 enemy
    // creatures.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && card.amber > 0,
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 4 })
                }
            })
        });

        this.play({
            fight: true,
            reap: true,
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 2,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.exalt()
                }
            }
        });
    }
}

Bawretchadontius.id = 'bawretchadontius';

export default Bawretchadontius;
