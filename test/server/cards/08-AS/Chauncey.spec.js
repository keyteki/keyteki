describe('Chauncey', function () {
    describe("Chauncey's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['shooler', 'chauncey']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should destroy a friendly creature and itself', function () {
            this.player1.useAction(this.chauncey);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.chauncey);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('discard');
            expect(this.chauncey.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should cause 3 amber gain', function () {
            this.player1.useAction(this.chauncey);
            this.player1.clickCard(this.shooler);
            expect(this.player1.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not give amber if no other creature is destroyed', function () {
            this.player1.fightWith(this.shooler, this.troll);
            this.player1.useAction(this.chauncey);
            expect(this.chauncey.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not give amber if Chauncey ward stop destruction', function () {
            this.chauncey.ward();
            this.player1.useAction(this.chauncey);
            this.player1.clickCard(this.shooler);
            expect(this.chauncey.location).toBe('play area');
            expect(this.shooler.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not give amber if other ward stop destruction', function () {
            this.shooler.ward();
            this.player1.useAction(this.chauncey);
            this.player1.clickCard(this.shooler);
            expect(this.chauncey.location).toBe('discard');
            expect(this.shooler.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
