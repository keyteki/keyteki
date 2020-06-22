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

    describe("Prince Derric Unifier's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['gub'],
                    hand: ['prince-derric-unifier', 'experimental-therapy']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should gain 6 ambers with experimental therapy', function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.gub);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.princeDerricUnifier);
            expect(this.player1.amber).toBe(3);
        });
    });
});
