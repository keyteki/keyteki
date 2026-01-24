describe('Tunk', function () {
    describe("Tunk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'mindwarper'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should fully heal when another Mars creature is played', function () {
            this.tunk.tokens.damage = 4;
            this.player1.playCreature(this.zorg);
            expect(this.tunk.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should trigger for each Mars creature played', function () {
            this.tunk.tokens.damage = 4;
            this.player1.playCreature(this.zorg);
            expect(this.tunk.tokens.damage).toBe(undefined);
            this.tunk.tokens.damage = 3;
            this.player1.playCreature(this.mindwarper);
            expect(this.tunk.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Tunk's ability with non-Mars creature", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not heal when a non-Mars creature is played', function () {
            this.tunk.tokens.damage = 4;
            this.player1.playCreature(this.dextre);
            expect(this.tunk.tokens.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
