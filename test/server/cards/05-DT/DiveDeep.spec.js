describe('Dive Deep', function () {
    describe('Play Ability with creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['dive-deep'],
                    inPlay: ['flaxia', 'groke']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump'],
                    discard: ['troll', 'groggins']
                }
            });
            this.player2.moveCard(this.troll, 'deck');
            this.player1.play(this.diveDeep);
        });

        it('discard from opponents deck and target same house creatures', function () {
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
        });

        describe('select opponent creature', function () {
            it('opponent should be in deck', function () {
                this.player1.clickCard(this.krump);
                expect(this.krump.location).toBe('deck');
                expect(this.groke.location).toBe('play area');
            });
        });

        describe('select friendly creature', function () {
            it('friendly creature should be in deck', function () {
                this.player1.clickCard(this.groke);
                expect(this.krump.location).toBe('play area');
                expect(this.groke.location).toBe('deck');
            });
        });
    });

    describe('Play Ability with no creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['dive-deep'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub'],
                    discard: ['troll', 'groggins']
                }
            });
            this.player2.moveCard(this.troll, 'deck');
            this.player1.play(this.diveDeep);
        });

        it('should fizzle after discard', function () {
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Play Ability with no cards in opponent deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['dive-deep'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub'],
                    deck: []
                }
            });
            this.player2.player.deck = [];
            this.player1.play(this.diveDeep);
        });

        it('should fizzle', function () {
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
