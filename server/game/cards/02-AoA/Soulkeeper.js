import Card from '../../Card.js';

class Soulkeeper extends Card {
    // This creature gains, Destroyed: Destroy the most powerful enemy creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                target: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    controller: 'opponent',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.destroy()
                }
            })
        });
    }
}

Soulkeeper.id = 'soulkeeper';

export default Soulkeeper;
