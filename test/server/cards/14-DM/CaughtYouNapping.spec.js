describe('CaughtYouNapping', function () {
    describe("Caught You Napping's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['caught-you-napping', 'murkens'],
                    inPlay: ['urchin']
                },
                player2: {
                    amber: 3,
                    hand: ['caught-you-napping'],
                    inPlay: ['bumpsy', 'krump', 'troll']
                }
            });
            this.caughtYouNapping1 = this.player1.hand[0];
            this.caughtYouNapping2 = this.player2.hand[0];
        });

        it('exhausts an enemy creature and steals 1 when overwhelmed', function () {
            this.player1.play(this.caughtYouNapping1);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 1 per exhausted enemy creature when overwhelmed', function () {
            this.krump.exhaust();
            this.player1.play(this.caughtYouNapping1);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not exhaust but still steals when not overwhelmed', function () {
            this.bumpsy.exhaust();
            this.player2.moveCard(this.krump, 'hand');
            this.player2.moveCard(this.troll, 'hand');
            this.player1.play(this.caughtYouNapping1);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not steal when no enemy creatures are exhausted', function () {
            this.player2.moveCard(this.krump, 'hand');
            this.player2.moveCard(this.troll, 'hand');
            this.player1.play(this.caughtYouNapping1);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it("exhausts and steals when played from opponent's deck", function () {
            this.player2.moveCard(this.caughtYouNapping2, 'deck');
            this.player1.play(this.murkens);
            this.player1.clickPrompt('Top of deck');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
