describe('Favor of Rex', function () {
    describe("Favor of Rex's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['favor-of-rex']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should not prompt for creature', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Favor of Rex's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 10,
                    inPlay: ['witch-of-the-wilds', 'chota-hazri', 'bumblebird'],
                    hand: ['favor-of-rex']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'charette', 'shooler', 'drumble']
                }
            });
        });

        it('should have no effect if creature has no Play: ability', function () {
            expect(this.player1.amber).toBe(10);
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.witchOfTheWilds);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(4);
            expect(this.chotaHazri.tokens.power).toBeUndefined();
            expect(this.charette.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should duplicate play effect of a friendly creature', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.witchOfTheWilds);
            expect(this.player1).toBeAbleToSelect(this.chotaHazri);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            this.player1.clickCard(this.chotaHazri);
            this.player1.clickPrompt('yes');
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(4);
        });

        it('should not cause Flaxia to fire with one fewer creatures', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(4);
        });

        it('should apply opponent correctly when capturing', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.charette);
            expect(this.charette.amber).toBe(3);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(1);
        });

        it('should apply opponent correctly when stealing', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.shooler);
            expect(this.player1.amber).toBe(12);
            expect(this.player2.amber).toBe(3);
        });

        it('should apply opponent correctly when Play: has a condition', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.drumble);
            expect(this.drumble.amber).toBe(0);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(4);
        });

        it('should duplicate play effect of a alpha creature', function () {
            this.player1.play(this.favorOfRex);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.bumblebird);
            expect(this.witchOfTheWilds.tokens.power).toBe(2);
            expect(this.chotaHazri.tokens.power).toBe(2);
            expect(this.bumblebird.tokens.power).toBeUndefined();
            expect(this.flaxia.tokens.power).toBeUndefined();
        });
    });
});
