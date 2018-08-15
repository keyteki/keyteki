const Card = require('../../Card.js');

class ResearchSmoko extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive(context => ({ target: context.player.deck[0] }))
        });
    }
}

ResearchSmoko.id = 'research-smoko'; // This is a guess at what the id might be - please check it!!!

module.exports = ResearchSmoko;
