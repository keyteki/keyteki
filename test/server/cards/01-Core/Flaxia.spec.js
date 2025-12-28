describe('Flaxia', function () {
    describe("Flaxia's ability with more creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['flaxia'],
                    inPlay: ['dust-pixie', 'dew-faerie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should gain 2 amber when controlling more creatures', function () {
            this.player1.play(this.flaxia);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Flaxia's ability with fewer creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['flaxia'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('should not gain amber when controlling fewer creatures', function () {
            this.player1.play(this.flaxia);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Flaxia's ability with equal creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['flaxia'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should gain amber when played with equal creatures', function () {
            this.player1.play(this.flaxia);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
