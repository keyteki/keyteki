const DrawCard = require('../../drawcard.js');

class MazeOfIllusion extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor and bow a character if your opponent can\'t guess your dial',
            condition: context => this.game.isDuringConflict() && context.player.opponent,
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: card => card.isParticipating(),
                gameAction: [ability.actions.bow(), ability.actions.dishonor()]
            },
            effect: 'bow and dishonor {0} if {1} can\'t guess whether their dial is even or odd',
            effectArgs: context => context.player.opponent,
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a value to set your honor dial at',
                context: context,
                choices: ['1', '2', '3', '4', '5'],
                handlers: [1,2,3,4,5].map(value => {
                    return () => this.opponentGuess(value, context);
                })
            })
        });
    }

    opponentGuess(value, context) {
        let choices = ['Even', 'Odd'];
        this.game.promptWithHandlerMenu(context.player.opponent, {
            activePromptTitle: 'Guess whether your opponent set their dial to even or odd',
            context: context,
            choices: choices,
            handlers: choices.map(choice => {
                return () => this.resolveAbility(choice, value, context);
            })
        });
    }

    resolveAbility(choice, value, context) {
        this.game.addMessage('{0} guesses {1}', context.player.opponent, choice);
        this.game.addMessage('{0} reveals their honor dial:{1}', context.player, value);
        context.player.showBid = value;
        if((choice === 'Odd') === (value % 2 === 0)) {
            context.game.applyGameAction(context, { bow: context.target, dishonor: context.target });
        }
    }
}

MazeOfIllusion.id = 'maze-of-illusion';

module.exports = MazeOfIllusion;
