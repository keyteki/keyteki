import Card from '../../Card.js';

class MyxTheTallminded extends Card {
    // Your opponent's keys cost +1 Aember for each friendly Mars
    // creature in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player) =>
                    (player.opponent &&
                        player.opponent.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                            .length) ||
                    0
            )
        });
    }
}

MyxTheTallminded.id = 'myx-the-tallminded';

export default MyxTheTallminded;
