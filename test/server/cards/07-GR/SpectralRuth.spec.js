describe('Spectral Ruth', function () {
    describe("Spectral Ruth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'brobnar',
                    hand: ['press-gang', 'pound', 'spectral-ruth'],
                    discard: ['flaxia', 'full-moon'].concat(new Array(7).fill('poke')) // not yet haunted
                },
                player2: {
                    inPlay: ['troll'],
                    discard: ['press-gang']
                }
            });
            this.player1.chains = 36;
        });

        it('does nothing on play if no keys forged this turn', function () {
            this.player1.playCreature(this.spectralRuth);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.discard.length).toBe(9);
            this.expectReadyToTakeAction(this.player1);
        });

        it('archives discard pile on play if a key forged this turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            this.player1.clickPrompt('brobnar');
            this.player1.playCreature(this.spectralRuth);
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player1.player.archives.length).toBe(9);
            expect(this.flaxia.location).toBe('archives');
            expect(this.fullMoon.location).toBe('archives');
            expect(this.poke.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not archive on destroy if not haunted', function () {
            this.player1.playCreature(this.spectralRuth);
            this.player1.play(this.pound);
            this.player1.clickCard(this.spectralRuth);
            expect(this.spectralRuth.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('archives on destroy if haunted', function () {
            this.player1.play(this.pressGang);
            this.player1.playCreature(this.spectralRuth);
            this.player1.play(this.pound);
            this.player1.clickCard(this.spectralRuth);
            expect(this.spectralRuth.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
