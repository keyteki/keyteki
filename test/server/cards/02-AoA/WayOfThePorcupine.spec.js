describe('Way of the Porcupine', function () {
    describe("Way of the Porcupine's hazardous grant", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['way-of-the-porcupine'],
                    inPlay: ['snufflegator', 'troll', 'witch-of-the-dawn']
                },
                player2: {
                    inPlay: ['krump', 'bumpsy']
                }
            });
        });

        it('grants hazardous 3 to the attached creature only, dealing 3 damage to attackers before fight without affecting neighbors', function () {
            this.player1.playUpgrade(this.wayOfThePorcupine, this.troll);
            expect(this.wayOfThePorcupine.parent).toBe(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            // Fighting a neighbor of the upgraded creature deals no hazardous damage to the attacker
            this.player2.fightWith(this.bumpsy, this.snufflegator);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.damage).toBe(4);
            // Fighting the upgraded creature itself triggers hazardous 3
            this.player2.fightWith(this.krump, this.troll);
            expect(this.krump.location).toBe('discard');
            expect(this.troll.damage).toBe(6);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
