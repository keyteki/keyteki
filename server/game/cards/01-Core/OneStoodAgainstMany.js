const Card = require('../../Card.js');

class OneStoodAgainstMany extends Card {
    setupCardAbilities(ability) {
        this.chosenTargets = [];

        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.resolveFight(context => ({
                        attacker: context.target,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to fight',
                            cardType: 'creature',
                            controller: 'opponent'
                        },
                        postHandler: (context, action) => {
                            this.chosenTargets = this.chosenTargets.concat(action.target);
                            if(action.target.length > 0) {
                                context.target.exhaust();
                            }
                        }
                    })),
                    ability.actions.ready(),
                    ability.actions.resolveFight(context => ({
                        attacker: context.target,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to fight',
                            cardType: 'creature',
                            controller: 'opponent',
                            cardCondition: card => !this.chosenTargets.includes(card)
                        },
                        postHandler: (context, action) => {
                            this.chosenTargets = this.chosenTargets.concat(action.target);
                            if(action.target.length > 0) {
                                context.target.exhaust();
                            }
                        }
                    })),
                    ability.actions.ready(),
                    ability.actions.resolveFight(context => ({
                        attacker: context.target,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to fight',
                            cardType: 'creature',
                            controller: 'opponent',
                            cardCondition: card => !this.chosenTargets.includes(card)
                        },
                        postHandler: (context, action) => {
                            if(action.target.length > 0) {
                                context.target.exhaust();
                            }
                        }
                    }))
                ])
            }
        });
    }
}

OneStoodAgainstMany.id = 'one-stood-against-many'; // This is a guess at what the id might be - please check it!!!

module.exports = OneStoodAgainstMany;
