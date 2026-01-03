describe('Soul Exchange', function () {
    describe("Soul Exchange's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['soul-exchange'],
                    inPlay: ['gemcoat-vendor', 'dust-imp'],
                    discard: ['poke', 'control-the-weak', 'shrewd-investor', 'timetraveller']
                },
                player2: {
                    inPlay: ['culf-the-quiet', 'groke'],
                    discard: ['spoils-of-battle', 'tremor', 'faust-the-great']
                }
            });
        });

        it('returns a creature from the player discard and destroys a creature', function () {
            this.player1.play(this.soulExchange);
            this.player1.clickPrompt('Mine');
            expect(this.shrewdInvestor.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);
            expect(this.player1).not.toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            this.player1.clickCard(this.dustImp);
            expect(this.dustImp.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('returns a creature from the opponent discard and destroys a creature', function () {
            this.player1.play(this.soulExchange);
            this.player1.clickPrompt("Opponent's");
            expect(this.faustTheGreat.location).toBe('hand');
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player1).not.toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).not.toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            this.player1.clickCard(this.groke);
            expect(this.groke.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('destroys a creature when there are no creatures to return', function () {
            this.player2.moveCard(this.faustTheGreat, 'hand');
            expect(this.faustTheGreat.location).toBe('hand');
            expect(this.player2.player.hand.length).toBe(1);
            this.player1.play(this.soulExchange);
            this.player1.clickPrompt("Opponent's");
            expect(this.faustTheGreat.location).toBe('hand');
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player1).not.toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).not.toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            this.player1.clickCard(this.groke);
            expect(this.groke.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
