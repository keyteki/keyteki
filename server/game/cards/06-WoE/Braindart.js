import Card from '../../Card.js';

class Braindart extends Card {
    //Play: Enrage an enemy creature. It captures 1A from its own side.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.sequential([
                    ability.actions.enrage(),
                    ability.actions.capture((context) => ({
                        amount: 1,
                        player: context.player.opponent
                    }))
                ])
            },
            effect: 'enrage {0} and make it capture 1 amber from its own side'
        });
    }
}

Braindart.id = 'braindart';

export default Braindart;
