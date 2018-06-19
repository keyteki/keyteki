const CardGameAction = require('./CardGameAction');
const Duel = require('../Duel.js');
const DuelFlow = require('../gamesteps/DuelFlow.js');

class DuelAction extends CardGameAction {
    setDefaultProperties() {
        this.type = '';
        this.challenger = null;
        this.resolutionHandler = null;
        this.costHandler = null;
    }

    setup() {
        this.name = 'duel';
        this.targetType = ['character'];
        this.effectMsg = 'initiate a ' + this.type + ' duel between {1} and {0}';
        this.effectArgs = () => {
            return this.challenger;
        };
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }
        return this.challenger && !this.challenger.hasDash(this.type) && card.location === 'play area' && !card.hasDash(this.type);
    }

    resolveDuel(winner, loser) {
        this.resolutionHandler(this.context, winner, loser);
    }

    honorCosts(prompt) {
        this.costHandler(this.context, prompt);
    }

    getEvent(card, context) {
        this.context = context;
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            if(this.challenger.location !== 'play area' || card.location !== 'play area') {
                context.game.addMessage('The duel cannot proceed as one participant is no longer in play');
                return;
            }
            context.game.currentDuel = new Duel(context.game, this.challenger, card, this.type);
            context.game.queueStep(new DuelFlow(context.game, context.game.currentDuel, this.costHandler ? prompt => this.honorCosts(prompt) : null, (winner, loser) => this.resolveDuel(winner, loser)));
        });
    }
}

module.exports = DuelAction;
