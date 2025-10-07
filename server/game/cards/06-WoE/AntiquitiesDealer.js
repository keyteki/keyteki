import Card from '../../Card.js';

class AntiquitiesDealer extends Card {
    // Action: Gain 2 if you control at least one artifact.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    context.player.cardsInPlay.filter((card) => card.type === 'artifact').length < 1
                        ? 0
                        : 2
            }))
        });
    }
}

AntiquitiesDealer.id = 'antiquities-dealer';

export default AntiquitiesDealer;
