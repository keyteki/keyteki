describe('Resurgence', function () {
    describe("Resurgence's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    inPlay: ['bull-wark', 'flaxia', 'knoxx'],
                    hand: ['resurgence', 'regrowth']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'shooler']
                }
            });
        });

        it('should not pick any card if discard is empty', function () {
            this.player1.play(this.resurgence);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not pick any card if discard does not have a creature', function () {
            this.player1.moveCard(this.regrowth, 'discard');
            this.player1.play(this.resurgence);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should pick a single card if only one non-mutant is in discard', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.moveCard(this.regrowth, 'discard');
            this.player1.play(this.resurgence);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.flaxia.location).toBe('hand');
        });

        it('should pick a single card if only one non-mutant is in discard', function () {
            this.player1.moveCard(this.bullWark, 'discard');
            this.player1.moveCard(this.regrowth, 'discard');
            this.player1.play(this.resurgence);
            this.player1.clickCard(this.bullWark);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.bullWark.location).toBe('hand');
        });

        it('should pick a single card if selected a non-mutant from discard', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.moveCard(this.bullWark, 'discard');
            this.player1.play(this.resurgence);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.flaxia.location).toBe('hand');
        });

        it('should pick two cards if selected a mutant from discard', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.moveCard(this.bullWark, 'discard');
            this.player1.play(this.resurgence);
            this.player1.clickCard(this.bullWark);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.bullWark.location).toBe('hand');
            expect(this.flaxia.location).toBe('hand');
        });
    });
});
