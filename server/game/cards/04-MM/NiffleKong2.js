const NiffleKong = require('./NiffleKong.js');

class NiffleKong2 extends NiffleKong {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.compositeParts = ['niffle-kong'];
    }
}

NiffleKong2.id = 'niffle-kong2';

module.exports = NiffleKong2;
