describe('Prince Derric Unifier', function () {
    describe("Prince Derric Unifier's play ability 1 house", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [],
                    hand: ['prince-derric-unifier']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not gain ambers since only Derric is in play', function () {
            this.player1.playCreature(this.princeDerricUnifier);
            expect(this.player1.amber).toBe(0);
        });
    });

    describe("Prince Derric Unifier's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['gub', 'shooler'],
                    hand: ['prince-derric-unifier']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not gain ambers since only two houses are in play', function () {
            this.player1.playCreature(this.princeDerricUnifier);
            expect(this.player1.amber).toBe(0);
        });
    });

    describe("Prince Derric Unifier's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['helper-bot', 'gub', 'shooler'],
                    hand: ['prince-derric-unifier']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should gain 3 ambers since three houses are in play', function () {
            this.player1.playCreature(this.princeDerricUnifier);
            expect(this.player1.amber).toBe(3);
        });
    });
});
