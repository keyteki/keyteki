var _ = require('underscore');

var plots = {};

// 01009 - Confiscation
plots['01009'] = {
    revealed: function(game, player, callback) {
        player.menuTitle = 'Select attachment to discard';
        player.buttons = [
            { text: 'Done', command: 'something' }
        ];

        player.selectCard = true;        
        player.callback = callback;
    },

    cardClicked: function(game, player, clicked) {
        if(clicked.type_code !== 'attachment') {
            return false;
        }

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to discard ' + clicked.label);

        player.selectCard = false;
        player.callback();

        return true;
    }
};

// 01010 - Counting coppers
plots['01010'] = {
    revealed: function(game, player, callback) {
        player.drawCardsToHand(3);

        game.addMessage(player.name + ' draws 3 cards from ' + player.activePlot.card.label);

        callback();
    }
};

// 02039 - Trading with the Pentoshi
plots['02039'] = {
    revealed: function(game, player, callback) {
        var otherPlayer = _.find(game.players, p => {
            return p.id !== player.id;
        });

        if(otherPlayer) {
            otherPlayer.gold += 3;

            game.addMessage(otherPlayer.name + ' gains 3 gold from ' + player.activePlot.card.label);
        }

        callback();
    }
};

module.exports = plots;
