describe('HymnToDuma,', function () {
    describe('when in play,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['chelonia', 'flaxia', 'haedroth-s-wall', 'hymn-to-duma']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        describe('should give omni option to', function () {
            it('creature 1', function () {
                this.player1.clickCard(this.chelonia);
                expect(this.player1).toHavePromptButton("Use this card's Omni ability");
            });

            it('creature 2', function () {
                this.player1.clickCard(this.flaxia);
                expect(this.player1).toHavePromptButton("Use this card's Omni ability");
            });
        });

        it('should not give omni to artifacts', function () {
            this.player1.clickCard(this.haedrothSWall);
            expect(this.player1).not.toHavePromptButton("Use this card's Omni ability");
        });

        describe('and omni is used', function () {
            beforeEach(function () {
                this.player1.clickCard(this.chelonia);
                this.player1.clickPrompt("Use this card's Omni ability");
            });

            it('should destroy the creature', function () {
                expect(this.chelonia.location).toBe('discard');
            });

            it('should prompt to select a friendly creature', function () {
                expect(this.player1).toHavePrompt('Choose a friendly creature to capture 2 amber');
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).not.toBeAbleToSelect(this.gub);
            });

            describe('and creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.flaxia);
                });

                it('should capture 2 amber', function () {
                    expect(this.flaxia.tokens.amber).toBe(2);
                    expect(this.player2.amber).toBe(1);
                });
            });
        });
    });
});
