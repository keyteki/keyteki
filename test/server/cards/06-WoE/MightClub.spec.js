describe('MightClub,', function () {
    describe('when action used with exhausted creature,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    inPlay: ['troll', 'krump', 'might-club']
                },
                player2: {
                    amber: 1,
                    inPlay: ['flaxia']
                }
            });

            this.player1.reap(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player1.useAction(this.mightClub);
        });

        it('should offer any creature to select', function () {
            expect(this.player1).toHavePrompt('Might Club');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
        });

        describe('and creature selected,', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('should ready and enrage creature', function () {
                expect(this.troll.exhausted).toBe(false);
                expect(this.troll.enraged).toBe(true);
            });
        });
    });
});
