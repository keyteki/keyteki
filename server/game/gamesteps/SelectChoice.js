class SelectChoice {
    constructor(choice) {
        this.choice = choice;
    }

    getShortSummary() {
        return {
            id: this.choice,
            label: this.choice,
            name: this.choice,
            type: 'select'
        };
    }    
}

module.exports = SelectChoice;