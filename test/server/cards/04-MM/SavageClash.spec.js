describe('savage-clash', function () {
    describe("Savage Clash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bot-bookton', 'bonesaw', 'hystricog', 'eldest-bear'],
                    hand: ['savage-clash']
                },
                player2: {
                    inPlay: ['daughter', 'ember-imp', 'barrister-joya']
                }
            });
        });

        it('destroys each creature except the most powerful enemy creature and the least powerful friendly creature', function () {
            this.player1.play(this.savageClash);

            expect(this.player1).toHavePrompt('Savage Clash');

            expect(this.player1).toBeAbleToSelect(this.barristerJoya);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.daughter);
            this.player1.clickCard(this.barristerJoya);

            expect(this.player1).toBeAbleToSelect(this.hystricog);
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            expect(this.player1).not.toBeAbleToSelect(this.bonesaw);
            expect(this.player1).not.toBeAbleToSelect(this.eldestBear);

            this.player1.clickCard(this.botBookton);

            expect(this.botBookton.location).toBe('play area');
            expect(this.bonesaw.location).toBe('discard');
            expect(this.hystricog.location).toBe('discard');
            expect(this.eldestBear.location).toBe('discard');

            expect(this.barristerJoya.location).toBe('play area');
            expect(this.emberImp.location).toBe('discard');
            expect(this.daughter.location).toBe('discard');
        });
    });
});
