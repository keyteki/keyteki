const Conflict = require('./conflict.js');
const ConflictFlow = require('./gamesteps/conflict/conflictflow.js');

class MenuCommands {
    static cardMenuClick(menuItem, game, player, card) {
        switch(menuItem.command) {
            case 'bow':
                if(card.bowed) {
                    game.addMessage('{0} readies {1}', player, card);
                    card.ready();
                } else {
                    game.addMessage('{0} bows {1}', player, card);
                    card.bow();
                }
                break;
            case 'honor':
                game.addMessage('{0} honors {1}', player, card);
                card.honor();
                break;
            case 'dishonor':
                game.addMessage('{0} dishonors {1}', player, card);
                card.dishonor();
                break;
            case 'addfate':
                game.addMessage('{0} adds a fate to {1}', player, card);
                card.modifyFate(1);
                break;
            case 'remfate':
                game.addMessage('{0} removes a fate from {1}', player, card);
                card.modifyFate(-1);
                break;
            case 'move':
                if(game.currentConflict) {
                    if(card.isParticipating()) {
                        game.addMessage('{0} moves {1} out of the conflict', player, card);
                        game.currentConflict.removeFromConflict(card);
                    } else {
                        game.addMessage('{0} moves {1} into the conflict', player, card);
                        if(card.controller.isAttackingPlayer()) {
                            game.currentConflict.addAttacker(card);
                        } else if(card.controller.isDefendingPlayer()) {
                            game.currentConflict.addDefender(card);
                        }
                    }
                }
                break;
            case 'control':
                if(player.opponent) {
                    game.addMessage('{0} gives {1} control of {2}', player, player.opponent, card);
                    card.setDefaultController(player.opponent);
                }
                break;
            case 'reveal':
                game.addMessage('{0} reveals {1}', player, card);
                card.facedown = false;
                break;
            case 'hide':
                game.addMessage('{0} flips {1} facedown', player, card);
                card.facedown = true;
                break;
            case 'break':
                game.addMessage('{0} {1} {2}', player, card.isBroken ? 'unbreaks' : 'breaks', card);
                card.isBroken = card.isBroken ? false : true;
                if(card.location === 'stronghold province' && card.isBroken) {
                    game.recordWinner(player.opponent, 'conquest');
                }
                break;
        }
    }

    static ringMenuClick(menuItem, game, player, ring) {
        switch(menuItem.command) {
            case 'flip':
                if(game.currentConflict && game.currentConflict.ring) {
                    game.addMessage('{0} switches the conflict type', player);
                    game.currentConflict.switchType();
                } else {
                    ring.flipConflictType();
                }
                break;
            case 'claim':
                game.addMessage('{0} claims the {1} ring', player, ring.element);
                ring.claimRing(player);
                break;
            case 'unclaimed':
                game.addMessage('{0} sets the {1} ring to unclaimed', player, ring.element);
                ring.resetRing();
                break;
            case 'contested':
                if(game.currentConflict) {
                    if(!ring.claimed) {
                        game.addMessage('{0} switches the conflict to contest the {1} ring', player, ring.element);
                        game.currentConflict.switchElement(ring.element);
                    } else {
                        game.addMessage('{0} tried to switch the conflict to contest the {1} ring, but it\'s already claimed', player, ring.element);
                    }
                }
                break;
            case 'addfate':
                game.addMessage('{0} adds a fate to the {1} ring', player, ring.element);
                ring.modifyFate(1);
                break;
            case 'remfate':
                game.addMessage('{0} removes a fate from the {1} ring', player, ring.element);
                ring.modifyFate(-1);
                break;
            case 'takefate':
                game.addMessage('{0} takes all the fate from the {1} ring and adds it to their pool', player, ring.element);
                player.modifyFate(ring.fate);
                ring.fate = 0;
                break;
            case 'conflict':
                if(game.currentActionWindow && game.currentActionWindow.windowName === 'preConflict') {
                    game.addMessage('{0} initiates a conflict', player);
                    var conflict = new Conflict(game, player, player.opponent, ring.conflictType, ring.element);
                    game.currentConflict = conflict;
                    game.queueStep(new ConflictFlow(game, conflict));
                    game.queueSimpleStep(() => game.currentConflict = null);
                } else {
                    game.addMessage('{0} tried to initiate a conflict, but game can only be done in a pre-conflict action window', player);
                }
                break;
        }
    }
}

module.exports = MenuCommands;
