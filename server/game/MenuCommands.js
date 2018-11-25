class MenuCommands {
    static cardMenuClick(menuItem, game, player, card) {
        switch(menuItem.command) {
            case 'exhaust':
                if(card.exhausted) {
                    game.addAlert('danger', '{0} readies {1}', player, card);
                    card.ready();
                } else {
                    game.addAlert('danger', '{0} exhausts {1}', player, card);
                    card.exhaust();
                }
                break;
            case 'addDamage':
                game.addAlert('danger', '{0} adds a damage to {1}', player, card);
                card.addToken('damage', 1);
                break;
            case 'remDamage':
                game.addAlert('danger', '{0} removes a damage from {1}', player, card);
                card.removeToken('damage', 1);
                break;
            case 'addAmber':
                game.addAlert('danger', '{0} adds an amber to {1}', player, card);
                card.addToken('amber', 1);
                break;
            case 'remAmber':
                game.addAlert('danger', '{0} removes an amber from {1}', player, card);
                card.removeToken('amber', 1);
                break;
            case 'stun':
                if(card.stunned) {
                    game.addAlert('danger', '{0} removes the stun from {1}', player, card);
                    card.stunned = false;
                } else {
                    game.addAlert('danger', '{0} stuns {1}', player, card);
                    card.stun();
                }
                break;
            case 'control':
                if(player.opponent) {
                    game.addAlert('danger', '{0} gives {1} control of {2}', player, player.opponent, card);
                    card.setDefaultController(player.opponent);
                }
                break;
        }
    }
}

module.exports = MenuCommands;
