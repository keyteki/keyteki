const Card = require('../../Card.js');

class ExterminateExterminate extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy a non-Mars creature for each Mars creature they control',
            gameAction: ability.actions.sequentialForEach(context => ({
                forEach: context.player.creaturesInPlay.filter(card => card.hasHouse('mars')),
                action: card => ability.actions.destroy({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to destroy with less power than ' + card.name,
                        cardType: 'creature',
                        cardCondition: c => !c.hasHouse('mars') && c.power < card.power,
                        context: context,
                        onSelect: (player, c) => {
                            this.game.addMessage('{0} chooses to destroy {1} with less power than {2}', player, c, card);
                            this.game.actions.destroy().resolve(c, context);
                            return true;
                        }
                    }
                })
            }))
        });
    }
}

ExterminateExterminate.id = 'exterminate-exterminate';

module.exports = ExterminateExterminate;
