const Card = require('../../Card.js');

class ComOfficerGross extends Card {
    //Play: You may search your deck for Com. Officer Hings (?), reveal it, and add it to your hand. Shuffle your deck.
    //Fight/Reap: Give a +1 power token to each creature between Com. Officer Gross and Com. Officer Hings.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search for Com. Officer Hings and add it to their hand',
            gameAction: ability.actions.search({
                cardName: 'Com. Officer Hings',
                location: ['deck'],
                amount: 1
            })
        });

        this.fight({
            reap: true,
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.name === 'Com. Officer Hings'
            },
            gameAction: ability.actions.addPowerCounter((context) => {
                if (!context.target) {
                    return {
                        target: []
                    };
                }
                let creaturesInPlay = context.player.creaturesInPlay;
                let idxS = creaturesInPlay.indexOf(context.source);
                let idxT = creaturesInPlay.indexOf(context.target);
                let targets = creaturesInPlay.slice(Math.min(idxS, idxT) + 1, Math.max(idxS, idxT));
                return {
                    target: targets
                };
            })
        });
    }
}

ComOfficerGross.id = 'com-officer-gross';

module.exports = ComOfficerGross;
