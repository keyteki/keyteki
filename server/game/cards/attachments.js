var attachments = {};

// 02004 - Lady
attachments['02004'] = {
    register: function(game) {
        game.on('beforeAttach', this.beforeAttach);
    },

    beforeAttach: function(game, player, target) {
        if(target.faction_code !== 'stark') {
            game.canAttach = false;
        }
    }    
};

module.exports = attachments;
