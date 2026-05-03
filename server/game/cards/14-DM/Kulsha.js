const GiganticCard = require('../../GiganticCard.js');

class Kulsha extends GiganticCard {
    // (Play only with the other half of Kulsha.)
    // Your opponent's keys cost +2A for each forged key they have.
    // After Fight/After Reap: Exhaust up to 3 creatures.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() =>
                this.controller.opponent ? 2 * this.controller.opponent.getForgedKeys() : 0
            )
        });

        this.fight({
            reap: true,
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.exhaust()
            },
            effect: 'exhaust {0}'
        });
    }
}

Kulsha.id = 'kulsha';

module.exports = Kulsha;
