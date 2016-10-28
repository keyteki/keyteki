var locations = {};

// 01040 - The Roseroad
locations['01040'] = {
    register: function(game, card) {
        game.on('beginMarshal', (game, player) => {
            player.gold++;

            game.addMessage(player.name + ' gained 1 gold from ' + card.label);
        });
    }
};

module.exports = locations;
