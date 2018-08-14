const BaseAction = require('./BaseAction');
const FightGameAction = require('../GameActions/FightGameAction');

class FightAction extends BaseAction {
    constructor(card) {
        super(card, {
            cardType: 'creature',
            gameAction: new FightGameAction({ attacker: card })
        });
        this.title = 'Fight with this creature';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('house') && context.player.activeHouse !== this.card.printedFaction) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && context.source.location !== 'play area') {
            return 'location';
        }
        if(!ignoredRequirements.includes('stunned') && context.source.stunned) {
            return 'stunned';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.game.addMessage('{0} exhausts {1} to fight {2}', context.player, context.source, context.target);
        context.game.actions.fight({ attacker: context.source }).resolve(context.target, context);
    }
}

module.exports = FightAction;

