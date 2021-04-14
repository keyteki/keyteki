const Card = require('../../Card.js');

class ComOfficerHings extends Card {
    //Play: You may search your deck for Com. Officer Gross (?), reveal it, and add it to your hand. Shuffle your deck.
    //Fight/Reap: Draw 1 card for each creature between Com. Officer Gross and Com. Officer Hings.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search for Com. Officer Hings and add it to their hand',
            gameAction: ability.actions.search({
                cardName: 'Com. Officer Gross',
                location: ['deck'],
                amount: 1
            })
        });

        this.fight({
            reap: true,
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.name === 'Com. Officer Gross'
            },
            gameAction: ability.actions.draw((context) => {
                if (!context.target) {
                    return { amount: 0 };
                }
                let creaturesInPlay = context.player.creaturesInPlay;
                let idxS = creaturesInPlay.indexOf(context.source);
                let idxT = creaturesInPlay.indexOf(context.target);
                let amount = Math.max(idxS, idxT) - Math.min(idxS, idxT) - 1;
                return {
                    target: context.player,
                    amount: amount
                };
            })
        });
    }
}

ComOfficerHings.id = 'com-officer-hings';

module.exports = ComOfficerHings;
