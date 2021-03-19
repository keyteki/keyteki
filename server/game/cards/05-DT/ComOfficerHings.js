const Card = require('../../Card.js');

class ComOfficerHings extends Card {
    //Play: You may search your deck for Com. Officer Gross (?), reveal it, and add it to your hand. Shuffle your deck.
    //Fight/Reap: Draw 1 card for each creature between Com. Officer Gross and Com. Officer Hings.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            effect: 'search for Com. Officer Hings and add it to their hand',
            gameAction: ability.actions.search({
                cardName: 'Com. Officer Gross?',
                amount: 1
            })
        });
        this.fight({
            reap: true,
            target: {
                controller: 'self',
                cardType: 'creatures',
                cardCondition: (card) => card.name === 'Com. Officer Gross?',
                gameAction: ability.actions.draw((context) => {
                    if (!context.target) {
                        return { amount: 0 };
                    }
                    let creaturesInPlay = context.player.creaturesInPlay;
                    let idxS = creaturesInPlay.indexOf(context.source);
                    let idxT = creaturesInPlay.indexOf(context.target);
                    return {
                        amount: Math.max(idxS, idxT) - Math.min(idxS, idxT) - 1
                    };
                })
            }
        });
    }
}

ComOfficerHings.id = 'com-officer-hings';

module.exports = ComOfficerHings;
