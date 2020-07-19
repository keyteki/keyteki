describe('Ghosthawk', function () {
    describe("Ghostform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'dew-faerie', 'snufflegator'],
                    hand: ['ghosthawk']
                },
                player2: {
                    inPlay: ['inka-the-spider']
                }
            });

            this.troll.tokens.damage = 4;
        });

        describe('when playing next to two ready creatures', function () {
            beforeEach(function () {
                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should prompt to reap with both cards', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            });

            describe('when clicking the left side', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.troll);
                });

                it('should reap with both creatures the card and trigger the reap effect', function () {
                    expect(this.player1.amber).toBe(3);
                    expect(this.troll.tokens.damage).toBe(1);
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });

            describe('when clicking the right side', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.dewFaerie);
                });

                it('should reap with both creatures the card and trigger the reap effect', function () {
                    expect(this.player1.amber).toBe(3);
                    expect(this.troll.tokens.damage).toBe(1);
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('when playing next to one ready and one exhausted ready creatures', function () {
            beforeEach(function () {
                this.dewFaerie.exhaust();

                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should not prompt to reap with exhausted creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            });

            it('should reap with one creature and trigger the reap effect', function () {
                this.player1.clickCard(this.troll);
                expect(this.player1.amber).toBe(1);
                expect(this.troll.tokens.damage).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
