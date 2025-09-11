describe('Bonded Auctioneer', function () {
    describe("Bonded Auctioneer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['bonded-auctioneer'],
                    inPlay: ['seeker-needle', 'uncommon-currency'],
                    discard: ['ornate-talking-tray']
                },
                player2: {
                    amber: 1,
                    inPlay: ['quixxle-stone']
                }
            });
        });

        describe('on reap', function () {
            beforeEach(function () {
                this.player1.playCreature(this.bondedAuctioneer);
                this.player1.endTurn();
                this.player2.clickPrompt('staralliance');
                this.player2.endTurn();
                this.player1.clickPrompt('ekwidon');
            });

            it('destroys own artifact and gains self 1 A', function () {
                this.player1.reap(this.bondedAuctioneer);
                expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
                expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
                expect(this.player1).toBeAbleToSelect(this.uncommonCurrency);
                expect(this.player1).toBeAbleToSelect(this.quixxleStone);
                this.player1.clickCard(this.seekerNeedle);
                expect(this.seekerNeedle.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('destroys opponent artifact and gains self 1 A', function () {
                this.player1.reap(this.bondedAuctioneer);
                this.player1.clickCard(this.quixxleStone);
                expect(this.quixxleStone.location).toBe('discard');
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(2);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('destroys stolen artifact and gains controller 1 A', function () {
                this.player1.useAction(this.uncommonCurrency);
                this.player1.clickCard(this.quixxleStone);
                this.player1.reap(this.bondedAuctioneer);
                this.player1.clickCard(this.quixxleStone);
                expect(this.quixxleStone.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        it('can return own artifact to hand on scrap', function () {
            this.player1.scrap(this.bondedAuctioneer);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player1).toBeAbleToSelect(this.quixxleStone);
            this.player1.clickCard(this.seekerNeedle);
            expect(this.player1.player.hand).toContain(this.seekerNeedle);
            expect(this.seekerNeedle.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can return opponent artifact to hand on scrap', function () {
            this.player1.scrap(this.bondedAuctioneer);
            this.player1.clickCard(this.quixxleStone);
            expect(this.quixxleStone.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.quixxleStone);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can return stolen artifact to hand on scrap', function () {
            this.player1.useAction(this.uncommonCurrency);
            this.player1.clickCard(this.quixxleStone);
            this.player1.scrap(this.bondedAuctioneer);
            this.player1.clickCard(this.quixxleStone);
            expect(this.quixxleStone.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.quixxleStone);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
