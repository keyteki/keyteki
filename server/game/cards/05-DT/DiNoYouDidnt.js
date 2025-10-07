import Card from '../../Card.js';

class DiNoYouDidnt extends Card {
    // Play: Destroy an enemy creature with A on it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

DiNoYouDidnt.id = 'di-no-you-didn-t';

export default DiNoYouDidnt;
