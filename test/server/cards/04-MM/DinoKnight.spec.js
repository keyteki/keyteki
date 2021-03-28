describe('Dino-Knight', function () {
    describe("Dino-Knight's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'sanctum',
                    hand: ['dino-knight']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });

            this.player1.play(this.dinoKnight);
        });

        it('should allow dino-knight to be exalted', function () {
            expect(this.player1).toHavePrompt('Any reactions to dino-knight being played?');
        });

        describe('and the ability is triggered', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dinoKnight);
            });

            it('should exalt dino-knight', function () {
                expect(this.dinoKnight.tokens.amber).toBe(1);
            });

            describe('should prompt to to do damage', function () {
                it('damage troll', function () {
                    expect(this.player1).toHavePrompt('Choose a creature');
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                    this.player1.clickCard(this.troll);
                    expect(this.troll.tokens.damage).toBe(3);
                });
            });
        });

        describe('and the ability is not triggered', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
            });

            it('should not exalt dino-knight', function () {
                expect(this.dinoKnight.tokens.amber).toBe(undefined);
            });
        });
    });
});
