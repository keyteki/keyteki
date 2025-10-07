import Card from '../../Card.js';

class TheGrandGord extends Card {
    // At the start of your turn, if you control the most powerful
    // creature (or a creature tied for most powerful), make a token
    // creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => {
                    if (context.player !== this.game.activePlayer) {
                        return false;
                    }

                    let max = Math.max.apply(
                        Math,
                        this.game.creaturesInPlay.map((card) => card.power)
                    );
                    let myMax = Math.max.apply(
                        Math,
                        context.player.creaturesInPlay.map((card) => card.power)
                    );
                    return myMax === max;
                }
            },
            effect: 'make a token creature',
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

TheGrandGord.id = 'the-grand-gord';

export default TheGrandGord;
