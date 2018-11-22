const CardUtil = {
    matchCardByNameAndPack(labelOrName) {
        var name = labelOrName;
        var pack;
        /* In throneteki, they have multiple cards with the same name,
        differentiated by what pack they came from
        */
        var match = labelOrName.match(/^(.*)\s\((.*)\)$/);
        if(match) {
            name = match[1];
            pack = match[2];
        }

        return function(cardData) {
            return (cardData.name === name && (!pack || cardData.pack_code === pack)) ||
                cardData.id === name;
        };
    }
};

module.exports = CardUtil;
