describe('Umwas', function () {
    describe("Umwas's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    hand: ['umwas'],
                    inPlay: ['niffle-brute:toad', 'dust-pixie']
                },
                player2: {
                    amber: 2,
                    token: 'prospector',
                    inPlay: ['prospector:toad']
                }
            });

            this.niffleBrute1 = this.player1.player.creaturesInPlay[0];
            this.niffleBrute2 = this.player1.player.deck[0];
            this.propsector1 = this.player2.player.creaturesInPlay[0];
        });

        it('should make a token creature and give tokens a power counter on play', function () {
            this.player1.playCreature(this.umwas);
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute2.location).toBe('play area');
            expect(this.niffleBrute1.getPower()).toBe(5);
            expect(this.niffleBrute2.getPower()).toBe(5);
            expect(this.dustPixie.getPower()).toBe(1);
            expect(this.umwas.getPower()).toBe(4);
            expect(this.propsector1.getPower()).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
