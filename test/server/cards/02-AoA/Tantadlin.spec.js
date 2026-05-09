describe('Tantadlin', function () {
    describe("Tantadlin's fight ability and damage limit", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['tantadlin']
                },
                player2: {
                    inPlay: ['troll'],
                    archives: ['krump', 'bumpsy']
                }
            });
        });

        it('only deals 2 damage when fighting and discards a random card from the opponent archives', function () {
            this.player1.fightWith(this.tantadlin, this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.tantadlin.damage).toBe(8);
            expect(this.player2.player.archives.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Tantadlin with empty opponent archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['tantadlin']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('still fights when the opponent archives is empty', function () {
            this.player1.fightWith(this.tantadlin, this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
