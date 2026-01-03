describe('Growland', function () {
    describe("Growland's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    inPlay: ['growland', 'yurk', 'fandangle']
                },
                player2: {
                    amber: 4,
                    inPlay: ['citizen-shrix', 'searine', 'urchin']
                }
            });
        });

        it('should allow destroying a Mutant creature after fighting', function () {
            this.player1.fightWith(this.growland, this.urchin);
            this.player1.clickCard(this.growland);
            expect(this.player1).toBeAbleToSelect(this.growland);
            expect(this.player1).toBeAbleToSelect(this.fandangle);
            expect(this.player1).not.toBeAbleToSelect(this.yurk);
            expect(this.player1).toBeAbleToSelect(this.citizenShrix);
            expect(this.player1).not.toBeAbleToSelect(this.searine);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.citizenShrix);
            expect(this.citizenShrix.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow destroying a Mutant creature after reaping', function () {
            this.player1.reap(this.growland);
            this.player1.clickCard(this.growland);
            this.player1.clickCard(this.citizenShrix);
            expect(this.citizenShrix.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be optional', function () {
            this.player1.reap(this.growland);
            this.player1.clickPrompt('Done');
            expect(this.citizenShrix.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should fully heal each friendly Mutant creature when scrapped', function () {
            this.player1.moveCard(this.growland, 'hand');
            this.yurk.tokens.damage = 1;
            this.fandangle.tokens.damage = 2;
            this.citizenShrix.tokens.damage = 1;
            this.player1.scrap(this.growland);
            expect(this.yurk.tokens.damage).toBe(1);
            expect(this.citizenShrix.tokens.damage).toBe(1);
            expect(this.fandangle.tokens.damage).toBeUndefined();
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
