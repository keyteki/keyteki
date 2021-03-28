describe('Livia the Elder', function () {
    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['livia-the-elder', 'brammo', 'thero-centurion', 'legatus-raptor']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'krump', 'bad-penny']
                }
            });

            this.player1.reap(this.liviaTheElder);
        });

        it('should offer to exalt livia', function () {
            expect(this.player1).toBeAbleToSelect(this.liviaTheElder);
        });

        describe('and the option is declined', function () {
            beforeEach(function () {
                this.player1.clickPrompt('done');
            });

            describe('and a card with a fight effect reaps', function () {
                beforeEach(function () {
                    this.player1.reap(this.theroCenturion);
                });

                it('should not trigger the fight effect', function () {
                    expect(this.player2.amber).toBe(2);
                    expect(this.theroCenturion.tokens.amber).toBe(undefined);
                });
            });
        });

        describe('and the option is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.liviaTheElder);
            });

            it('should exalt livia', function () {
                expect(this.liviaTheElder.tokens.amber).toBe(1);
            });

            describe('and a card with a fight effect reaps', function () {
                beforeEach(function () {
                    this.player1.reap(this.theroCenturion);
                });

                it('should trigger the fight effect', function () {
                    expect(this.player2.amber).toBe(1);
                    expect(this.theroCenturion.tokens.amber).toBe(1);
                });
            });

            describe('and a card with a reap effect fights', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.legatusRaptor, this.badPenny);
                });

                it('should trigger the fight effect', function () {
                    expect(this.player1).toBeAbleToSelect(this.legatusRaptor);

                    this.player1.clickCard(this.legatusRaptor);

                    expect(this.legatusRaptor.tokens.amber).toBe(1);
                });
            });
        });
    });
});
