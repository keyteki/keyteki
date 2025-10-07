import Card from '../../Card.js';

class Warrior extends Card {
    // Warrior cannot reap unless there are no enemy creatures in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card === context.source &&
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length > 0,
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Warrior.id = 'warrior';

export default Warrior;
