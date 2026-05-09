const Card = require('../../Card.js');

class YipyaxAbductor extends Card {
    // Play/After Fight: Put an upgrade from play into your
    // archives. If you are not the owner of that card and it leaves
    // your archives, put it into its owner’s hand instead.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'upgrade',
                controller: 'any',
                gameAction: [
                    ability.actions.archive((context) => ({
                        target: context.target?.owner === context.player ? context.target : []
                    })),
                    ability.actions.abduct((context) => ({
                        target: context.target?.owner !== context.player ? context.target : []
                    }))
                ]
            }
        });
    }
}

YipyaxAbductor.id = 'yipyax-abductor';

module.exports = YipyaxAbductor;
