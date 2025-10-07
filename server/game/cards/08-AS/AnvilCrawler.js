import Card from '../../Card.js';

class AnvilCrawler extends Card {
    // Each player refills their hand to 1 additional card during
    // their “draw cards” step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

AnvilCrawler.id = 'anvil-crawler';

export default AnvilCrawler;
