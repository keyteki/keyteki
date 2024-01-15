describe('Immersioneer', function () {
    describe("Immersioneer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['immersioneer'],
                    discard: ['crushing-deep', 'ancient-bear', 'cpo-zytar', 'skullback-crab']
                },
                player2: {}
            });
        });

        describe('on reap', function () {
            beforeEach(function () {
                this.player1.playCreature(this.immersioneer);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('unfathomable');
                this.player1.reap(this.immersioneer);
            });

            it('discard from controller deck on reap', function () {
                this.player1.clickPrompt('Mine');
                expect(this.player1.player.discard.length).toBe(7);
            });

            it('discard from opponent deck on reap', function () {
                this.player1.clickPrompt("Opponent's");
                expect(this.player2.player.discard.length).toBe(3);
            });
        });

        it('should shuffle bottom 3 of discard into deck on scrap', function () {
            this.player1.scrap(this.immersioneer);
            expect(this.player1.player.discard.length).toBe(2);
            expect(this.immersioneer.location).toBe('discard');
            expect(this.crushingDeep.location).toBe('discard');
            expect(this.ancientBear.location).toBe('deck');
            expect(this.cpoZytar.location).toBe('deck');
            expect(this.skullbackCrab.location).toBe('deck');
        });

        it('should shuffle self into deck on scrap if discard is small', function () {
            this.player1.moveCard(this.crushingDeep, 'hand');
            this.player1.moveCard(this.ancientBear, 'hand');
            this.player1.moveCard(this.cpoZytar, 'hand');
            this.player1.scrap(this.immersioneer);
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.immersioneer.location).toBe('deck');
            expect(this.crushingDeep.location).toBe('hand');
            expect(this.ancientBear.location).toBe('hand');
            expect(this.cpoZytar.location).toBe('hand');
            expect(this.skullbackCrab.location).toBe('deck');
        });
    });
});
