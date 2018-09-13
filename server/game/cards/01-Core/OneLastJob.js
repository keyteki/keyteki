const Card = require('../../Card.js');

class OneLastJob extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'purge each friendly shadows creature and gain that much amber',
            gameAction: [
                ability.actions.purge(context => ({ target: context.player.creaturesInPlay.filter(card => card.hasHouse('shadows')) })),
                ability.actions.gainAmber(context => ({ amount: context.player.creaturesInPlay.filter(card => card.hasHouse('shadows')).length }))
            ]
        });
    }
}

OneLastJob.id = 'one-last-job'; // This is a guess at what the id might be - please check it!!!

module.exports = OneLastJob;
