describe('The Red Baron', function () {
    describe("The Red Baron's omni ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: ['the-red-baron', 'brammo']
                },
                player2: {
                    amber: 8,
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it("should gain elusive when opponent's forged a red key", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.fightWith(this.krump, this.theRedBaron);
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.theRedBaron.tokens.damage).toBeUndefined();

            this.player2.fightWith(this.troll, this.theRedBaron);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.theRedBaron.location).toBe('discard');
        });

        it("should not gain elusive when opponent's forged a blue key", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.fightWith(this.krump, this.theRedBaron);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.theRedBaron.location).toBe('discard');
        });

        it("should not gain elusive when opponent's forged a yellow key", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Yellow');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.fightWith(this.krump, this.theRedBaron);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.theRedBaron.location).toBe('discard');
        });

        it('should not give elusive to other creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.fightWith(this.troll, this.brammo);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.brammo.location).toBe('discard');
        });
    });

    describe("The Red Baron's omni ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 3,
                    inPlay: ['troll']
                },
                player2: {
                    amber: 8,
                    inPlay: ['the-red-baron']
                }
            });
        });

        it('should steal after reap when forged a red key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.reap(this.theRedBaron);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(2);
        });

        it('should not steal after reap when forged a blue key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.reap(this.theRedBaron);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(3);
        });

        it('should not steal after reap when forged a yellow key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Yellow');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(2);

            this.player2.reap(this.theRedBaron);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(3);
        });
    });
});
