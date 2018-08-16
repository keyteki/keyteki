const Conflict = require('./conflict.js');

class MenuCommands {
    static cardMenuClick(menuItem, game, player, card) {
        switch(menuItem.command) {
            case 'exhaust':
                if(card.exhausted) {
                    game.addMessage('{0} readies {1}', player, card);
                    card.ready();
                } else {
                    game.addMessage('{0} exhausts {1}', player, card);
                    card.exhaust();
                }
                break;
            case 'addDamage':
                game.addMessage('{0} adds a damage to {1}', player, card);
                card.addToken('damage');
                break;
            case 'remDamage':
                game.addMessage('{0} removes a damage from {1}', player, card);
                card.removeToken('damage');
                break;
            case 'addAmber':
                game.addMessage('{0} adds an amber to {1}', player, card);
                card.addToken('amber');
                break;
            case 'remAmber':
                game.addMessage('{0} removes an amber from {1}', player, card);
                card.removeToken('amber');
                break;
            case 'stun':
                if(card.stunned) {
                    game.addMessage('{0} removes the stun from {1}', player, card);
                    card.stunned = false;
                } else {
                    game.addMessage('{0} stuns {1}', player, card);
                    card.stun();
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
        }
    }
}

module.exports = MenuCommands;
