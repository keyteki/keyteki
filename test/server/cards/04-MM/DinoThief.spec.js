describe('Dino-Thief', function () {
    describe("Dino-Thief's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'shadows',
                    hand: ['dino-thief']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });

            this.player1.play(this.dinoThief);
        });

        it('should allow dino-thief to be exalted', function () {
            expect(this.player1).toHavePrompt('Any reactions to dino-thief being played?');
        });

        describe('and the ability is triggered', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dinoThief);
            });

            it('should exalt dino-thief', function () {
                expect(this.dinoThief.tokens.amber).toBe(1);
            });

            describe('should prompt to to do damage', function () {
                it('damage troll', function () {
                    expect(this.player1).toHavePrompt('Choose a creature');
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).toBeAbleToSelect(this.dinoThief);
                    this.player1.clickCard(this.troll);
                    expect(this.troll.tokens.damage).toBe(3);
                });
            });
        });

        describe('and the ability is not triggered', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
            });

            it('should not exalt dino-thief', function () {
                expect(this.dinoThief.tokens.amber).toBe(undefined);
            });
        });
    });
});
