describe('Cold Ropes', function () {
    describe('Cold Ropes when not overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['cold-ropes'],
                    inPlay: ['bosun-creen', 'flip-stallard', 'troll']
                },
                player2: {
                    inPlay: ['bad-penny', 'krump', 'bumpsy']
                }
            });
        });

        it('moves an enemy non-flank creature to a flank and exhausts it', function () {
            this.player1.play(this.coldRopes);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).not.toBeAbleToSelect(this.flipStallard);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.exhausted).toBe(true);
            expect(this.krump.location).toBe('play area');
            expect(this.krump.isOnFlank()).toBe(true);
            expect(this.badPenny.location).toBe('play area');
            expect(this.badPenny.exhausted).toBe(false);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Cold Ropes when overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['cold-ropes']
                },
                player2: {
                    inPlay: ['bad-penny', 'krump', 'bumpsy']
                }
            });
        });

        it('puts an enemy creature on the bottom of its owner deck', function () {
            this.player1.play(this.coldRopes);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('deck');
            expect(this.badPenny.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            const deck = this.player2.player.deck;
            expect(deck[deck.length - 1]).toBe(this.krump);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
