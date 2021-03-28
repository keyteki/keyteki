describe('Greater Oxtet', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'dis',
                    inPlay: ['greater-oxtet'],
                    hand: ['troll', 'valdr', 'shaffles']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone'],
                    hand: ['malison']
                }
            });
        });

        describe('when the ready cards step is ended with purgable cards', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('should allow a card to be purged from hand', function () {
                expect(this.player1).toBeAbleToSelect(this.valdr);
                expect(this.player1).not.toBeAbleToSelect(this.greaterOxtet);
                expect(this.player1).not.toBeAbleToSelect(this.malison);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            });

            describe('and a card is purged', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.valdr);
                });

                it('that card is purged', function () {
                    expect(this.valdr.location).toBe('purged');
                });

                it('two power counters are added to greater oxtet', function () {
                    expect(this.greaterOxtet.tokens.power).toBe(2);
                });
            });
        });

        describe('when the ready cards step is eneded and no cards are purgeable', function () {
            beforeEach(function () {
                this.player1.player.hand = [];
                this.player1.endTurn();
            });

            it('no power counters are added to greater oxtet', function () {
                expect(this.player1).toHavePrompt('Waiting for opponent');
                expect(this.greaterOxtet.tokens.power).toBe(undefined);
            });
        });
    });
});
