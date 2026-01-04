describe('Administrator Rivet', function () {
    describe("Administrator Rivet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['administrator-rivet', 'a-strong-feeling'],
                    inPlay: ['minion:poke', 'touchstone'],
                    deck: new Array(12).fill('toad'),
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 4,
                    token: 'prospector',
                    inPlay: ['prospector:toad']
                }
            });

            this.minion1 = this.player1.player.creaturesInPlay[0];
            this.minion2 = this.player1.player.deck[0];
        });

        it('should make a token on play, with no capture if not haunted', function () {
            this.player1.playCreature(this.administratorRivet);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion2);
            expect(this.minion1.amber).toBe(0);
            expect(this.minion2.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a token and capture on each token on play if haunted', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.playCreature(this.administratorRivet);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion2);
            expect(this.minion1.amber).toBe(1);
            expect(this.minion2.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
