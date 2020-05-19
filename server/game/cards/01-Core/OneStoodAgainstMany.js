const Card = require('../../Card.js');

class OneStoodAgainstMany extends Card {
    setupCardAbilities(ability) {
        this.chosenTargets = [];

        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.resolveFight((context) => ({
                        attacker: context.target,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to fight',
                            cardType: 'creature',
                            controller: 'opponent'
                        },
                        postHandler: (context, action) => (this.chosenTargets = action.target)
                    })),
                    ability.actions.resolveFight((context) => ({
                        attacker: context.target,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to fight',
                            cardType: 'creature',
                            controller: 'opponent',
                            cardCondition: (card) => !this.chosenTargets.includes(card)
                        },
                        postHandler: (context, action) =>
                            (this.chosenTargets = this.chosenTargets.concat(action.target))
                    })),
                    ability.actions.resolveFight((context) => ({
                        attacker: context.target,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to fight',
                            cardType: 'creature',
                            controller: 'opponent',
                            cardCondition: (card) => !this.chosenTargets.includes(card)
                        }
                    }))
                ])
            }
        });
    }
}

OneStoodAgainstMany.id = 'one-stood-against-many';

module.exports = OneStoodAgainstMany;
