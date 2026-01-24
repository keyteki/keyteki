describe('Thundertow', function () {
    describe('Thundertow Behaviour', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'unfathomable',
                    inPlay: ['hookmaster', 'tantadlin', 'ancient-bear'],
                    hand: ['thundertow']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp']
                }
            });

            this.troll.exhaust();
            this.player1.reap(this.hookmaster);
            this.player1.play(this.thundertow);
        });

        it('should be able to select creatures to exhaust', function () {
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.narp);
        });

        describe('when two creatures are selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
                expect(this.player1).not.toHavePromptButton('Done');
                this.player1.clickCard(this.narp);
                this.player1.clickPrompt('Done');
            });

            it('should exhaust the creatures', function () {
                expect(this.troll.exhausted).toBe(true);
                expect(this.narp.exhausted).toBe(true);
            });

            it('should deal 2D to each exhausted creature', function () {
                expect(this.narp.damage).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.hookmaster.damage).toBe(1);
            });
        });
    });
});
