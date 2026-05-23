describe('Mega Shorty', function () {
    describe("Mega Shorty's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mega-shorty']
                },
                player2: {
                    inPlay: ['looter-goblin', 'nexus', 'troll']
                }
            });
        });

        it('enrages Mega Shorty after reaping', function () {
            this.player1.reap(this.megaShorty);
            expect(this.megaShorty.enraged).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('clears enrage when killed by assault during a fight', function () {
            this.megaShorty.enrage();
            this.player1.fightWith(this.megaShorty, this.nexus);
            expect(this.megaShorty.damage).toBe(0);
            expect(this.megaShorty.enraged).toBe(false);
            expect(this.nexus.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
