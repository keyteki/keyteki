describe('Hydrocataloguer', function () {
    describe("Hydrocataloguer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hydrocataloguer', 'dextre', 'archimedes'],
                    hand: ['eureka']
                },
                player2: {
                    inPlay: ['bulwark', 'armsmaster-molina']
                }
            });

            this.player1.moveCard(this.archimedes, 'deck');
            this.player2.moveCard(this.bulwark, 'deck');
        });

        describe('when controller raises the tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should archive the top card of the deck', function () {
                expect(this.archimedes.location).toBe('archives');
                expect(this.player1.chains).toBe(3);
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('sanctum');
                this.player2.raiseTide();
            });

            it('they should archive the top card of the deck', function () {
                expect(this.bulwark.location).toBe('archives');
                expect(this.player2.chains).toBe(3);
            });
        });

        describe('when decks are empty', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player2.player.deck = [];
            });

            describe('when controller raises the tide', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                });

                it('should not archive anything', function () {
                    expect(this.player1.player.archives.length).toBe(0);
                    expect(this.player1.chains).toBe(3);
                });
            });

            describe('when opponent raises the tide', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('sanctum');
                    this.player2.raiseTide();
                });

                it('they should not archive anything', function () {
                    expect(this.player2.player.archives.length).toBe(0);
                    expect(this.player2.chains).toBe(3);
                });
            });
        });
    });
});
