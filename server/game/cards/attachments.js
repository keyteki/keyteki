var attachments = {};

// 01035 - Milk Of The Poppy
class MilkOfThePoppy {
    constructor(player, attachment) {
        this.player = player;
        this.attachment = attachment;

        this.beforeAttach = this.beforeAttach.bind(this);
        this.cardLeavingPlay = this.cardLeavingPlay.bind(this);
    }

    beforeAttach(game, player, attachment, target) {
        if(this.attachment !== attachment) {
            return;
        }

        var targetInPlay = player.findCardInPlayByUuid(target.uuid);
        if(!targetInPlay) {
            var otherPlayer = game.getOtherPlayer(player);

            targetInPlay = otherPlayer.findCardInPlayByUuid(target.uuid);
        }

        this.text = targetInPlay.card.text;    
        this.card = targetInPlay.card;
        targetInPlay.card.text = '';
    }

    cardLeavingPlay(game, player, card) {
        if(this.attachment !== card) {
            return;
        }

        this.card.text = this.text;
    }
}
attachments['01035'] = {
    register: function(game, player, card) {
        var implementation = new MilkOfThePoppy(player, card);

        game.playerCards[player.id + card.uuid] = implementation;

        game.on('beforeAttach', implementation.beforeAttach);
        game.on('cardLeavingPlay', implementation.cardLeavingPlay);
    },
    unregister: function(game, player, card) {
        var implementation = game.playerCards[player.id + card.uuid];

        game.removeListener('beforeAttach', implementation.beforeAttach);
        game.removeListener('cardLeavingPlay', implementation.cardLeavingPlay);
    }
};


// 02004 - Lady
// attachments['02004'] = {
//     register: function(game) {
//         game.on('beforeAttach', this.beforeAttach);
//     },

//     beforeAttach: function(game, player, target) {
//         if(target.faction_code !== 'stark') {
//             game.canAttach = false;
//         }
//     }
// };

// 02112 - Drowned God's Blessing
attachments['02112'] = {
    register: function(game, player, card) {
        card.initiative = 1;
        // TODO: Character gains 'Drowned God' trait, immune to single target events.
    },
    unregister: function(game, player, card) {
    }
};

// 05020 - Shield of Lannisport
attachments['05020'] = {
    register: function(game, player, card) {
        card.income = 1;
        // TODO: Strength and renown
    },
    unregister: function(game, player, card) {
    }
};

module.exports = attachments;
