describe('Saurus Rex', function () {
    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['shadow-self', 'saurus-rex', 'troll'],
                    hand: ['urchin', 'gargantodon', 'legatus-raptor']
                },
                player2: {
                    inPlay: ['archimedes', 'dextre', 'faygin', 'gorm-of-omm']
                }
            });

            this.player1.moveCard(this.gargantodon, 'deck');
            this.player1.moveCard(this.urchin, 'deck');
        });

        describe('when in center of battleline', function () {
            beforeEach(function () {
                this.player1.reap(this.saurusRex);
            });

            it('should allow the card to be exalted', function () {
                expect(this.player1).toBeAbleToSelect(this.saurusRex);
            });

            describe('and the exalt is triggered', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.saurusRex);
                });

                it('should exalt saurus rex', function () {
                    expect(this.saurusRex.tokens.amber).toBe(1);
                });

                it('should prompt for a deck search for saurian cards', function () {
                    expect(this.player1).toHavePrompt('Choose a card');
                    expect(this.player1).toBeAbleToSelect(this.gargantodon);
                    expect(this.player1).not.toBeAbleToSelect(this.urchin);
                });
            });

            describe('and exalt is not triggered', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('done');
                });

                it('should not exalt saurus rex', function () {
                    expect(this.saurusRex.tokens.amber).toBe(undefined);
                });

                it('should not prompt for a deck search', function () {
                    expect(this.player1).not.toHavePrompt('Choose a card');
                });
            });
        });

        describe('when not in center of battleline', function () {
            beforeEach(function () {
                this.player1.play(this.legatusRaptor);
                this.player1.reap(this.saurusRex);
            });

            it('should not trigger the reap effect', function () {
                expect(this.player1).not.toBeAbleToSelect(this.saurusRex);
            });
        });
    });
});
