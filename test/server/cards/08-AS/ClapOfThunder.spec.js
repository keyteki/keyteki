describe('Clap of Thunder', function () {
    describe("Clap of Thunder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'krump', 'alaka', 'groggins'],
                    hand: ['clap-of-thunder']
                },
                player2: {
                    inPlay: ['flaxia', 'narp']
                }
            });

            this.alaka.ward();
            this.player1.reap(this.troll);
            this.player1.play(this.clapOfThunder);
        });

        it('should destroy the least powerful creature', function () {
            expect(this.player1).toHavePrompt('Clap of Thunder');
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.narp);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
        });

        it('should ready and enrage the most powerful creature', function () {
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePrompt('Clap of Thunder');
            expect(this.player1).not.toBeAbleToSelect(this.alaka);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.troll.enraged).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can enrage enemy creature', function () {
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.narp);
            expect(this.narp.exhausted).toBe(false);
            expect(this.narp.enraged).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should still ready and enrage when no creature destroyed', function () {
            this.player1.clickCard(this.alaka);
            expect(this.alaka.location).toBe('play area');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.troll.enraged).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
