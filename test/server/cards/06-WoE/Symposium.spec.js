describe('Symposium', function () {
    describe("Symposium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    inPlay: ['pelf', 'grumpus:press-gang'],
                    hand: ['symposium']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should exalt, ready, and use a friendly creature', function () {
            this.player1.play(this.symposium);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grumpus);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.pelf.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if you use a token first', function () {
            this.player1.play(this.symposium);
            this.player1.clickCard(this.grumpus);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.grumpus.amber).toBe(1);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.pelf.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('optionally do nothing after using a token', function () {
            this.player1.play(this.symposium);
            this.player1.clickCard(this.grumpus);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.grumpus.amber).toBe(1);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Symposium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    token: 'cultist',
                    inPlay: ['pelf', 'cultist:press-gang'],
                    hand: ['symposium']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should exalt, ready, and use a friendly creature after token is destroyed', function () {
            this.player1.play(this.symposium);
            this.player1.clickCard(this.cultist);
            this.player1.clickPrompt("Use this card's action ability");
            this.player1.clickCard(this.pelf);
            expect(this.cultist.location).toBe('discard');
            expect(this.pelf.warded).toBe(true);
            expect(this.player2.amber).toBe(2);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.pelf.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
