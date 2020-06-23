fdescribe('Lucky Dice', function () {
    describe("Lucky Dice's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lucky-dice', 'lamindra', 'dodger', 'brend-the-fanatic'],
                    amber: 3
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'bingle-bangbang'],
                    hand: ['brammo', 'ballcano']
                }
            });
        });

        it('should not prevent damage during owner turn', function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player1.fightWith(this.dodger, this.bingleBangbang);
            expect(this.dodger.tokens.damage).toBe(2);
        });

        it("should prevent damage during opponent's turn", function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.ballcano);
            this.player2.play(this.brammo);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.lamindra.location).toBe('play area');
            expect(this.dodger.location).toBe('play area');
            expect(this.brendTheFanatic.location).toBe('play area');
            expect(this.lamindra.tokens.damage).toBeUndefined();
            expect(this.dodger.tokens.damage).toBeUndefined();
            expect(this.brendTheFanatic.tokens.damage).toBeUndefined();
        });

        it('should last for one round only', function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.ballcano);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.fightWith(this.dodger, this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.brammo);
            expect(this.lamindra.location).toBe('discard');
            expect(this.brendTheFanatic.tokens.damage).toBe(2);
        });
    });
});
