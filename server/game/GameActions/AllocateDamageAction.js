const GameAction = require('./GameAction');
const AllocateDamagePrompt = require('../gamesteps/AllocateDamagePrompt');

class AllocateDamageAction extends GameAction {
    setDefaultProperties() {
        this.cardCondition = () => true;
        this.damageStep = 1;
        this.numSteps = 0;
    }

    preEventHandler(context) {
        this.events = [];
        context.game.queueStep(new AllocateDamagePrompt(context.game, {
            cardCondition: this.cardCondition,
            damageStep: this.damageStep,
            numSteps: this.numSteps,
            context: context,
            onSelect: cardDamage => {
                for(const uuid of Object.keys(cardDamage)) {
                    const card = context.game.findAnyCardInPlayByUuid(uuid);
                    if(card) {
                        this.events.push(context.game.actions.dealDamage({ amount: cardDamage[uuid] }).getEvent(card, context));
                    }
                }
            }
        }));
    }

    getEventArray() {
        return this.events;
    }
}

module.exports = AllocateDamageAction;
