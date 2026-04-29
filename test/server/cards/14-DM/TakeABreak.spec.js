describe('Take a Break', function () {
    describe("Take a Break's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['take-a-break'],
                    inPlay: ['silvertooth']
                },
                player2: {
                    inPlay: ['bumpsy', 'troll', 'urchin', 'krump', 'mooncurser']
                }
            });
        });

        it('exhausts the least powerful enemy creature and its neighbors', function () {
            this.player1.play(this.takeABreak);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            this.player1.clickCard(this.urchin);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.mooncurser.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot select friendly creatures', function () {
            this.player1.play(this.takeABreak);
            expect(this.player1).not.toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
