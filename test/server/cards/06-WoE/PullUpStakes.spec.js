describe('PullUpStakes,', function () {
    describe('on play with friendly creatures,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'pull-up-stakes'],
                    inPlay: ['flaxia', 'chelonia', 'floomf', 'myliobe']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'dendrix', 'infurnace', 'snag']
                }
            });

            this.player1.play(this.pullUpStakes);
        });

        it('should offer friendly creatures', function () {
            expect(this.player1).toHavePrompt('Pull Up Stakes');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.chelonia);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
        });

        it('should not allow selecting only one friendly creature', function () {
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Done');
        });

        describe('and choosing two friendly creatures,', function () {
            beforeEach(function () {
                this.player1.clickCard(this.flaxia);
                this.player1.clickCard(this.chelonia);
                this.player1.clickPrompt('Done');
            });

            it("should shuffle the chosen creatures into their owners' decks", function () {
                expect(this.flaxia.location).toBe('deck');
                expect(this.chelonia.location).toBe('deck');
            });

            it('should offer enemy creatures', function () {
                expect(this.player1).toHavePrompt('Pull Up Stakes');
                expect(this.player1).not.toBeAbleToSelect(this.floomf);
                expect(this.player1).not.toBeAbleToSelect(this.myliobe);
                expect(this.player1).toBeAbleToSelect(this.gub);
                expect(this.player1).toBeAbleToSelect(this.krump);
            });

            it('should not allow selecting only one enemy creature', function () {
                this.player1.clickCard(this.gub);
                expect(this.player1).not.toHavePromptButton('Done');
            });

            describe('and choosing four enemy creatures,', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.gub);
                    this.player1.clickCard(this.krump);
                    this.player1.clickCard(this.dendrix);
                    this.player1.clickCard(this.infurnace);
                    this.player1.clickPrompt('Done');
                });

                it("should return the chosen creatures to their owners' hands", function () {
                    expect(this.gub.location).toBe('hand');
                    expect(this.krump.location).toBe('hand');
                    expect(this.dendrix.location).toBe('hand');
                    expect(this.infurnace.location).toBe('hand');
                    expect(this.player2.inPlay.length).toBe(1);
                });
            });
        });
    });

    describe('on play with no friendly creatures,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'pull-up-stakes'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'dendrix', 'infurnace', 'snag']
                }
            });

            this.player1.play(this.pullUpStakes);
        });

        describe('should still work and skip to the 2nd action, and', function () {
            it('should offer enemy creatures,', function () {
                expect(this.player1).toHavePrompt('Pull Up Stakes');
                expect(this.player1).toBeAbleToSelect(this.gub);
                expect(this.player1).toBeAbleToSelect(this.krump);
                expect(this.player1).toBeAbleToSelect(this.dendrix);
                expect(this.player1).toBeAbleToSelect(this.infurnace);
            });

            describe('on choosing four enemy creatures,', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.gub);
                    this.player1.clickCard(this.krump);
                    this.player1.clickCard(this.dendrix);
                    this.player1.clickCard(this.infurnace);
                    this.player1.clickPrompt('Done');
                });

                it("should return the chosen creatures to their owners' hands", function () {
                    expect(this.gub.location).toBe('hand');
                    expect(this.krump.location).toBe('hand');
                    expect(this.dendrix.location).toBe('hand');
                    expect(this.infurnace.location).toBe('hand');
                    expect(this.player2.inPlay.length).toBe(1);
                });
            });
        });
    });

    describe('on play with friendly creatures but no enemy creatures,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'pull-up-stakes'],
                    inPlay: ['flaxia', 'chelonia', 'floomf', 'myliobe']
                },
                player2: {
                    amber: 1,
                    inPlay: []
                }
            });

            this.player1.play(this.pullUpStakes);
        });

        describe('should still work, and', function () {
            it('should offer friendly creatures,', function () {
                expect(this.player1).toHavePrompt('Pull Up Stakes');
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).toBeAbleToSelect(this.chelonia);
                expect(this.player1).toBeAbleToSelect(this.floomf);
                expect(this.player1).toBeAbleToSelect(this.myliobe);
            });

            describe('on choosing two friendly creatures,', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.flaxia);
                    this.player1.clickCard(this.chelonia);
                    this.player1.clickPrompt('Done');
                });

                it("should shuffle the chosen creatures into their owners' decks", function () {
                    expect(this.flaxia.location).toBe('deck');
                    expect(this.chelonia.location).toBe('deck');
                });

                it('should be the end of the effect', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });
    });

    describe('on play with only one creature on each side,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'pull-up-stakes'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub']
                }
            });

            this.player1.play(this.pullUpStakes);
        });

        describe('should still work, and', function () {
            it('should offer friendly creatures,', function () {
                expect(this.player1).toHavePrompt('Pull Up Stakes');
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).not.toBeAbleToSelect(this.gub);
            });

            describe('on choosing a friendly creature,', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.flaxia);
                    this.player1.clickPrompt('Done');
                });

                it("should shuffle the chosen creature into its owner's deck", function () {
                    expect(this.flaxia.location).toBe('deck');
                });

                it('should offer enemy creatures,', function () {
                    expect(this.player1).toHavePrompt('Pull Up Stakes');
                    expect(this.player1).toBeAbleToSelect(this.gub);
                });

                describe('on choosing an enemy creature,', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.gub);
                        this.player1.clickPrompt('Done');
                    });

                    it("should return the chosen creature to its owner's hand", function () {
                        expect(this.gub.location).toBe('hand');
                    });
                });
            });
        });
    });
});
