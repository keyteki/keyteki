const Effects = {
    modifyStrength: function(value) {
        return {
            apply: function(card) {
                card.strengthModifier += value;
            },
            unapply: function(card) {
                card.strengthModifier -= value;
            }
        };
    },
    dynamicStrength: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicStrength = context.dynamicStrength || {};
                context.dynamicStrength[card] = calculate(card, context);
                card.strengthModifier += context.dynamicStrength[card];
            },
            unapply: function(card, context) {
                card.strengthModifier -= context.dynamicStrength[card];
                delete context.dynamicStrength[card];
            },
            isStateDependent: true
        };
    },
    addIcon: function(icon) {
        return {
            apply: function(card) {
                card.setIcon(icon);
            },
            unapply: function(card) {
                card.clearIcon(card);
            }
        };
    },
    addKeyword: function(keyword) {
        return {
            apply: function(card) {
                card.addKeyword(keyword);
            },
            unapply: function(card) {
                card.removeKeyword(keyword);
            }
        };
    },
    addTrait: function(trait) {
        return {
            apply: function(card) {
                card.addTrait(trait);
            },
            unapply: function(card) {
                card.removeTrait(trait);
            }
        };
    },
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    }
};

module.exports = Effects;
