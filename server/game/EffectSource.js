class EffectSource {
    constructor() {
        this.name = 'Framework efffect';
        this.id = this.name;
        this.factions = {};
        this.traits = {};
        this.type = '';
    }

    isUnique() {
        return false;
    }

    isBlank() {
        return false;
    }

    getType() {
        return this.type;
    }

    getPrintedFaction() {
        return null;
    }

    hasKeyword() {
        return false;
    }

    hasTrait(trait) {
        let traitCount = this.traits[trait.toLowerCase()] || 0;
        return traitCount > 0;
    }

    getTraits() {
        return _.keys(_.omit(this.traits, trait => trait < 1));
    }
            
    isFaction(faction) {
        return !!this.factions[faction.toLowerCase()];
    }
            
    hasToken() {
        return false;
    }
            
    getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            type: this.getType()
        };
    }

}

module.exports = EffectSource;