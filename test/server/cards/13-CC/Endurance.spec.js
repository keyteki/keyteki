describe('Endurance', function () {
    describe("Endurance's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['aero-o-fore', 'endurance', 'black-tempest', 'charette', 'bux-bastian']
                },
                player2: {
                    inPlay: ['umbra', 'nantucket']
                }
            });
        });

        it('should give Skyborn neighbors the ability to ready and fight after reaping', function () {
            this.player1.reap(this.aeroOFore);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.aeroOFore.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.reap(this.blackTempest);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.nantucket);
            expect(this.nantucket.location).toBe('discard');
            expect(this.blackTempest.tokens.damage).toBe(2);
            expect(this.blackTempest.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not affect non-Skyborn neighbors', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.moveCard(this.blackTempest, 'discard');
            this.player1.reap(this.charette);
            expect(this.charette.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not affect non-neighbor Skyborn creatures', function () {
            this.player1.reap(this.buxBastian);
            expect(this.buxBastian.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
