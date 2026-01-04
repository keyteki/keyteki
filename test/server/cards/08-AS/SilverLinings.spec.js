describe('Silver Linings', function () {
    describe("Silver Linings's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['silver-linings', 'bosun-creen'],
                    inPlay: ['flaxia', 'dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should gain 1 extra amber when 1 house among friendly flank creatures', function () {
            this.player1.play(this.silverLinings);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 2 extra amber when 2 houses among friendly flank creatures', function () {
            this.player1.playCreature(this.bosunCreen);
            this.player1.play(this.silverLinings);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 3 extra amber when 2 houses among friendly flank creatures', function () {
            this.bosunCreen.enhancements = ['logos'];
            this.player1.playCreature(this.bosunCreen);
            this.player1.play(this.silverLinings);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
