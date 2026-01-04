describe('Stooge', function () {
    describe("Stooge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    inPlay: ['seeker-needle', 'stooge:toad', 'stooge:toad']
                },
                player2: {
                    amber: 2
                }
            });

            this.stooge1 = this.player1.player.creaturesInPlay[0];
            this.stooge2 = this.player1.player.creaturesInPlay[1];
            this.stooge3 = this.player1.player.deck[0];
            this.stooge4 = this.player1.player.deck[1];
        });

        it('should make a token on action when on flank', function () {
            this.player1.useAction(this.stooge1);
            this.player1.clickPrompt('Right');
            expect(this.stooge3.location).toBe('play area');
            this.player1.useAction(this.stooge2);
            expect(this.stooge4.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
