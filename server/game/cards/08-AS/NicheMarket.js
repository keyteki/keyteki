import Card from '../../Card.js';

class NicheMarket extends Card {
    // Each creature with the lowest power gains, “Action: Steal 1A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) => {
                if (context.game.creaturesInPlay.length === 0) {
                    return false;
                }

                let lowestPower = context.game.creaturesInPlay.sort((a, b) => a.power - b.power)[0]
                    .power;
                return card.type === 'creature' && card.power === lowestPower;
            },
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

NicheMarket.id = 'niche-market';

export default NicheMarket;
