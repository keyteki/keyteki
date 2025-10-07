import Card from '../../Card.js';

class AncientBattleground extends Card {
    //Each friendly creature cannot reap and gains, "After Fight: Gain 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: [
                ability.effects.cardCannot('reap'),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainAmber({ amount: 1 })
                })
            ]
        });
    }
}

AncientBattleground.id = 'ancient-battleground';

export default AncientBattleground;
