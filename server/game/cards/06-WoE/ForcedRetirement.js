import Card from '../../Card.js';

class ForcedRetirement extends Card {
    //Play: Destroy a creature. If you do, its controller gains 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.gainAmber({
                    amount: 1,
                    target: preThenContext.target.controller
                })
            })
        });
    }
}

ForcedRetirement.id = 'forced-retirement';

export default ForcedRetirement;
