describe('Gigantor', function () {
    describe("Gigantor's after fight/reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['gigantor', 'gigantor2'],
                    discard: ['pen-pal', 'mack-the-knife', 'change-agent', 'bad-penny']
                },
                player2: {
                    inPlay: ['bumpsy'],
                    discard: ['troll', 'urchin']
                }
            });
            this.player1.play(this.gigantor);
            this.gigantor.ready();
        });

        it('purges up to 3 cards from your discard pile and draws that many cards', function () {
            const handSize = this.player1.hand.length;
            const startingPurged = this.player1.player.purged.length;
            this.player1.reap(this.gigantor);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.penPal);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickCard(this.changeAgent);
            // Attempting to select a 4th card should not add it
            this.player1.clickCard(this.badPenny);
            this.player1.clickPrompt('Done');
            expect(this.penPal.location).toBe('purged');
            expect(this.mackTheKnife.location).toBe('purged');
            expect(this.changeAgent.location).toBe('purged');
            expect(this.badPenny.location).toBe('discard');
            expect(this.player1.player.purged.length).toBe(startingPurged + 3);
            expect(this.player1.hand.length).toBe(handSize + 3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can purge from the opponent discard pile', function () {
            const handSize = this.player1.hand.length;
            const startingPurged = this.player2.player.purged.length;
            this.player1.reap(this.gigantor);
            this.player1.clickPrompt("Opponent's");
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('purged');
            expect(this.urchin.location).toBe('purged');
            expect(this.player2.player.purged.length).toBe(startingPurged + 2);
            expect(this.player1.hand.length).toBe(handSize + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('purges fewer than 3 and draws that many cards', function () {
            const handSize = this.player1.hand.length;
            this.player1.reap(this.gigantor);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.penPal);
            this.player1.clickPrompt('Done');
            expect(this.penPal.location).toBe('purged');
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers after fight', function () {
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.gigantor, this.bumpsy);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.penPal);
            this.player1.clickPrompt('Done');
            expect(this.penPal.location).toBe('purged');
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not count cards already in the purge', function () {
            this.player1.moveCard(this.penPal, 'purged');
            const handSize = this.player1.hand.length;
            this.player1.reap(this.gigantor);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt('Done');
            expect(this.mackTheKnife.location).toBe('purged');
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
