const DrawCard = require('../../drawcard.js');

class TaryuJiai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a glory duel between two shugenja',
            condition: () => this.game.isDuringConflict(),
            targets: {
                myShugenja: {
                    activePromptTitle: 'Choose a friendly shugenja',
                    controller: 'self',
                    cardType: 'character',
                    cardCondition: card => card.hasTrait('shugenja')
                },
                oppShugenja: {
                    dependsOn: 'myShugenja',
                    activePromptTitle: 'Choose an opposing shugenja',
                    controller: 'opponent',
                    cardType: 'character',
                    cardCondition: card => card.hasTrait('shugenja'),
                    gameAction: ability.actions.duel(context => ({
                        type: 'glory',
                        challenger: context.targets.myShugenja,
                        resolutionHandler: winner => winner && this.resolveRingEffect(winner.controller, context, ability)
                    }))
                }
            },
            effect: 'initiate a glory duel between {1} and {2}',
            effectArgs: context => [context.targets.myShugenja, context.targets.oppShugenja]
        });
    }

    resolveRingEffect(player, context, ability) {
        this.game.promptForRingSelect(player, {
            activePromptTitle: 'Choose a ring effect to resolve',
            onSelect: (player, ring) => {
                this.game.addMessage('{0} chooses to resolve {1}\'s effect', player, ring);
                this.game.openThenEventWindow(ability.actions.resolveRingEffect().getEvent(ring, context));
                return true;
            }
        });
    }
}

TaryuJiai.id = 'taryu-jiai';

module.exports = TaryuJiai;
