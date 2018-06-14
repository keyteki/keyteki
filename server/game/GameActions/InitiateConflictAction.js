const PlayerAction = require('./PlayerAction');

class InitiateConflictAction extends PlayerAction {
    setDefaultProperties() {
        this.canPass = true;
    }

    setup() {
        super.setup();
        this.name = 'initiateConflict';
        this.effectMsg = 'declare a new conflict';
    }

    canAffect(player, context) {
        let availableConflictTypes = ['military', 'political'].filter(type => player.getConflictOpportunities(type));
        if(!player.cardsInPlay.any(card => availableConflictTypes.some(type => card.canDeclareAsAttacker(type)))) {
            // No legal attackers
            return false;
        } else if(!Object.values(context.game.rings).some(ring => ring.canDeclare(player))) {
            // No legal rings
            return false;
        }
        return super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onConflictInitiated', { 
            player: player, 
            context: context
        }, () => context.game.initiateConflict(player, this.canPass));
    }
}

module.exports = InitiateConflictAction;
