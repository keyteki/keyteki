describe('Jump Start', function () {
    describe('Jump Start when not overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['jump-start'],
                    inPlay: ['flip-stallard', 'bosun-creen']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('readies and uses a flank creature once', function () {
            this.flipStallard.exhaust();
            this.player1.play(this.jumpStart);
            this.player1.clickCard(this.flipStallard);
            // Player chooses how to use it (e.g. reap)
            this.player1.clickPrompt('Reap with this creature');
            expect(this.flipStallard.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Jump Start when overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['jump-start'],
                    inPlay: ['flip-stallard']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('repeats the ready and use', function () {
            this.flipStallard.exhaust();
            this.player1.play(this.jumpStart);
            this.player1.clickCard(this.flipStallard);
            this.player1.clickPrompt('Reap with this creature');
            // After first ready+use, repeat triggers since still overwhelmed
            this.player1.clickCard(this.flipStallard);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.flipStallard.exhausted).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
