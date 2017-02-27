const CardUtil = {
    matchCardByNameAndPack(labelOrName) {
        var name = labelOrName;
        var pack;
        var match = labelOrName.match(/^(.*)\s\((.*)\)$/);
        if(match) {
            name = match[1];
            pack = match[2];
        }

        return function(cardData) {
            return cardData.name === name && (!pack || cardData.pack_code === pack);
        };
    }
};

module.exports = CardUtil;
