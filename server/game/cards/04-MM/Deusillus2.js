const Deusillus = require('./Deusillus.js');

class Deusillus2 extends Deusillus {    
    playWithId() {
        return 'deusillus';
    }
}

Deusillus2.id = 'deusillus-2';

module.exports = Deusillus2;
