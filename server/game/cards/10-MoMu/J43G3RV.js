const GiganticCard = require('../../GiganticCard.js');

class J43G3RV extends GiganticCard {
    // (Play only with the other half of J43G3R V.)
    // After Reap: You may reap with up to 2 non-Star Alliance creatures this
    // turn.
    // After Fight: You may fight with up to 2 non-Star Alliance creatures this
    // turn.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.reap({
            effect: 'allow them to reap with up to 2 non staralliance card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: [
                    ability.effects.canReapNonHouse('staralliance'),
                    ability.effects.canReapNonHouse('staralliance')
                ]
            })
        });

        this.fight({
            effect: 'allow them to fight with up to 2 non staralliance card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: [
                    ability.effects.canFightNonHouse('staralliance'),
                    ability.effects.canFightNonHouse('staralliance')
                ]
            })
        });
    }
}

J43G3RV.id = 'j43g3r-v';

module.exports = J43G3RV;
