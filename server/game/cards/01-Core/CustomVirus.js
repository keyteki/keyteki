const Card = require('../../Card.js');

class CustomVirus extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                gameAction: [
                    ability.actions.purge(),
                    ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter((card) =>
                            card.getTraits().some((trait) => context.target.hasTrait(trait))
                        )
                    }))
                ]
            },
            effect: 'purge {0} and destroy each creature which shares a trait with it',
            gameAction: ability.actions.sacrifice()
        });
    }
}

CustomVirus.id = 'custom-virus';

module.exports = CustomVirus;
