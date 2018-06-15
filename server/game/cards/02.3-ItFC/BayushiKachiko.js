const DrawCard = require('../../drawcard.js');

class BayushiKachiko extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home',
            condition: context => this.game.isDuringConflict('political') && context.source.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.politicalSkill < context.source.politicalSkill,
                gameAction: ability.actions.sendHome()
            },
            then: context => ({
                target: {
                    mode: 'select',
                    activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                    choices: {
                        'Yes': ability.actions.bow({ target: context.target }),
                        'No': () => true
                    }
                },
                message: '{0} chooses to bow {2} due to {1}\'s ability'
            })
        });
    }
}

BayushiKachiko.id = 'bayushi-kachiko';

module.exports = BayushiKachiko;
