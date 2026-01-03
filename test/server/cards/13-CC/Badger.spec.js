describe('Badger', function () {
    describe("Badger's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['badger', 'shorty', 'culf-the-quiet', 'rant-and-rive'],
                    inPlay: ['foozle']
                },
                player2: {
                    inPlay: ['troll', 'flaxia', 'silvertooth']
                }
            });
        });

        it('should deal 3 damage to enemy creature after playing Brobnar creature on play', function () {
            this.player1.play(this.badger);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            this.player1.play(this.shorty);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).not.toBeAbleToSelect(this.shorty);
            expect(this.player1).not.toBeAbleToSelect(this.foozle);
            expect(this.player1).not.toBeAbleToSelect(this.badger);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not trigger for action cards', function () {
            this.player1.play(this.badger);
            this.player1.clickCard(this.troll);
            this.player1.play(this.rantAndRive);
            this.expectReadyToTakeAction(this.player1);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.flaxia.tokens.damage).toBeUndefined();
        });

        it('should trigger multiple times for multiple Brobnar creatures', function () {
            this.player1.play(this.badger);
            this.player1.clickCard(this.troll);
            this.player1.play(this.shorty);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(6);

            this.player1.play(this.culfTheQuiet);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should trigger after reaping', function () {
            this.player1.moveCard(this.badger, 'play area');
            this.badger.exhausted = false;
            this.player1.reap(this.badger);
            this.player1.play(this.shorty);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
