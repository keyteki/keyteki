var _ = require('underscore');

var plots = {};

// 01009 - Confiscation
plots['01009'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
        game.on('cardClicked', this.cardClicked);
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        player.menuTitle = 'Select attachment to discard';
        player.buttons = [
            { text: 'Done', command: 'something' }
        ];

        player.selectCard = true;
        game.pauseForPlot = true;   
    },

    cardClicked: function(game, player, clicked) {
        if(clicked.type_code !== 'attachment') {
            return false;
        }

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to discard ' + clicked.label);

        player.selectCard = false;
        
        game.revealDone(player);

        return true;
    }
};

// 01010 - Counting coppers
plots['01010'] = {
    register: function(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        player.drawCardsToHand(3);

        game.addMessage(player.name + ' draws 3 cards from ' + player.activePlot.card.label);
    }
};

// 02039 - Trading with the Pentoshi
plots['02039'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        var otherPlayer = _.find(game.players, p => {
            return p.id !== player.id;
        });

        if(otherPlayer) {
            otherPlayer.gold += 3;

            game.addMessage(otherPlayer.name + ' gains 3 gold from ' + player.activePlot.card.label);
        }
    }
};

module.exports = plots;
