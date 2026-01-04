describe('Carlo Phantom', function () {
    describe("Carlo Phantom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['carlo-phantom'],
                    hand: ['library-of-babble', 'batdrone', 'foggify', 'rocket-boots'],
                    amber: 0
                },
                player2: {
                    amber: 2,
                    hand: ['cannon']
                }
            });
        });

        it('should steal 1 amber when an artifact is played', function () {
            this.player1.play(this.libraryOfBabble);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber when a creature is played', function () {
            this.player1.play(this.batdrone);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber when an action is played', function () {
            this.player1.play(this.foggify);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber when an upgrade is played', function () {
            this.player1.playUpgrade(this.rocketBoots, this.carloPhantom);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber when opponent plays a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.cannon);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
