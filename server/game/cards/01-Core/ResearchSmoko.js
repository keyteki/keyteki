import Card from '../../Card.js';

class ResearchSmoko extends Card {
    // Destroyed: Archive the top card of your deck.
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });
    }
}

ResearchSmoko.id = 'research-smoko';

export default ResearchSmoko;
