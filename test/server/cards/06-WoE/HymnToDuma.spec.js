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

        it('should not give omni to opponent creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.gub);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton("Use this card's Omni ability");
        });

        describe("and creature's omni is used", function () {
            beforeEach(function () {
                this.player1.useAction(this.chelonia, true);
            });

            it('should destroy the creature', function () {
                expect(this.chelonia.location).toBe('discard');
            });

            it('should prompt to select a friendly creature', function () {
                expect(this.player1).toHavePrompt('Choose a creature');
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

        describe("and creature's omni is used with ward,", function () {
            beforeEach(function () {
                this.chelonia.ward();
                this.player1.useAction(this.chelonia, true);
            });

            it('should destroy the ward only', function () {
                expect(this.chelonia.warded).toBe(false);
                expect(this.chelonia.location).toBe('play area');
            });

            describe('and creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.flaxia);
                });

                it('should still capture 2 amber', function () {
                    expect(this.flaxia.tokens.amber).toBe(2);
                    expect(this.player2.amber).toBe(1);
                });
            });
        });
    });
});
