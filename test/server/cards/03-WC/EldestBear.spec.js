describe('Eldest Bear', function () {
    describe("Eldest Bear's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['eldest-bear'],
                    hand: ['dust-pixie', 'dew-faerie']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });
        });
        it("have 'Before Fight: Gain 2A' if in center [1]", function () {
            this.player1.fightWith(this.eldestBear, this.troll);
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Assault');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
        });
        it("not have 'Before Fight: Gain 2A' if not in center [2]", function () {
            this.player1.play(this.dustPixie);
            this.player1.fightWith(this.eldestBear, this.troll);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
        });
        it("have 'Before Fight: Gain 2A' if in center [2]", function () {
            this.player1.play(this.dustPixie);
            this.player1.play(this.dewFaerie, true);
            this.player1.fightWith(this.eldestBear, this.troll);
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Assault');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(6);
        });
    });
});
