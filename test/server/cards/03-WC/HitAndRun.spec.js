describe('Hit and Run', function () {
    describe("Hit and Run's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['flaxia', 'knoxx', 'helper-bot'],
                    hand: ['hit-and-run']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'troll']
                }
            });
        });

        it('Hit a friendly creature and return a friendly creature to hand', function () {
            this.player1.play(this.hitAndRun);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.helperBot);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.knoxx);
            expect(this.knoxx.location).toBe('hand');
            expect(this.flaxia.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
        });

        it('Hit a friendly creature and return a friendly creature to hand', function () {
            this.player1.play(this.hitAndRun);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.flaxia);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.knoxx);
            expect(this.knoxx.location).toBe('hand');
            expect(this.flaxia.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.flaxia.tokens.damage).toBe(2);
        });

        it('Hit an enemy creature and return a friendly creature to hand', function () {
            this.player1.play(this.hitAndRun);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.troll);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.knoxx);
            expect(this.knoxx.location).toBe('hand');
            expect(this.flaxia.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(2);
        });
        it('Hit an enemy creature warded and return a friendly creature to hand', function () {
            this.troll.tokens.ward = 1;
            expect(this.troll.warded).toBe(true);
            this.player1.play(this.hitAndRun);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.troll);

            expect(this.player1).toHavePrompt('Hit and Run');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.knoxx);
            expect(this.knoxx.location).toBe('hand');
            expect(this.flaxia.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.hasToken('damage')).toBe(false);
            expect(this.troll.hasToken('ward')).toBe(false);
        });
    });
});
