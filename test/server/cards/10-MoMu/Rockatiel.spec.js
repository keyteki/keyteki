describe('Rockatiel', function () {
    describe("Rockatiel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['rockatiel'],
                    inPlay: ['flaxia']
                },
                player2: {
                    inPlay: ['fandangle', 'lamindra']
                }
            });
        });

        it('should shuffle two creatures in on play', function () {
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat(event.player))
            );
            this.player1.playCreature(this.rockatiel);
            expect(this.player1).toBeAbleToSelect(this.fandangle);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.rockatiel);
            this.player1.clickCard(this.fandangle);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');
            expect(this.fandangle.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(shuffled.length).toBe(2);
            expect(shuffled).toContain(this.player1.player);
            expect(shuffled).toContain(this.player2.player);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should shuffle two creatures in on reap', function () {
            this.player1.playCreature(this.rockatiel);
            this.player1.clickCard(this.fandangle);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat(event.player))
            );
            this.rockatiel.exhausted = false;
            this.player1.reap(this.rockatiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.rockatiel);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.rockatiel);
            this.player1.clickPrompt('Done');
            expect(this.lamindra.location).toBe('deck');
            expect(this.rockatiel.location).toBe('deck');
            expect(shuffled.length).toBe(2);
            expect(shuffled).toContain(this.player1.player);
            expect(shuffled).toContain(this.player2.player);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow shuffling in fewer than 2 creatures', function () {
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat(event.player))
            );
            this.player1.playCreature(this.rockatiel);
            expect(this.player1).toBeAbleToSelect(this.fandangle);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.rockatiel);
            this.player1.clickCard(this.fandangle);
            this.player1.clickPrompt('Done');
            expect(this.fandangle.location).toBe('deck');
            expect(shuffled.length).toBe(1);
            expect(shuffled).toContain(this.player2.player);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
