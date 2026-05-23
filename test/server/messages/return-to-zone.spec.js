describe('Return Messages', function () {
    describe('return to hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['snudge']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when returning card to hand', function () {
            this.player1.reap(this.snudge);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Snudge to reap with Snudge',
                'player1 uses Snudge to return Troll to their hand'
            ]);
        });
    });

    describe('return to deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['symon']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when returning card to deck', function () {
            this.player1.fightWith(this.symon, this.emberImp);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Symon to make Symon fight Ember Imp',
                "player1 uses Symon to return Ember Imp to the top of their owner's deck"
            ]);
        });
    });

    describe('return to deck with empty target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['timequake']
                },
                player2: {}
            });
        });

        it("should log 'return nothing' when no cards are shuffled into the deck", function () {
            this.player1.play(this.timequake);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Timequake',
                "player1 uses Timequake's amber bonus icon to gain 1 amber",
                "player1 uses Timequake to return nothing to their owner's deck"
            ]);
        });
    });
});
