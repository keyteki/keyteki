describe('Sleepwither', function () {
    describe("Sleepwither's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    hand: ['sleepwither'],
                    inPlay: ['caspart']
                },
                player2: {
                    inPlay: ['troll', 'noxious-ionox']
                }
            });
        });

        it('destroys an Ouboros creature and gains 2', function () {
            this.player1.play(this.sleepwither);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.caspart);
            expect(this.caspart.location).toBe('discard');
            // 0 + 2
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target an enemy Ouboros creature', function () {
            this.player1.play(this.sleepwither);
            expect(this.player1).toBeAbleToSelect(this.noxiousIonox);
            this.player1.clickCard(this.noxiousIonox);
            expect(this.noxiousIonox.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target non-Ouboros creature', function () {
            this.player1.play(this.sleepwither);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.caspart);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
