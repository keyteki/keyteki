describe('PullUpStakes,', function () {
    describe('on play,', function () {
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
});
