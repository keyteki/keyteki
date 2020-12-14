describe('Zorg', function () {
    describe("Zorg's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'exhume', 'three-fates']
                },
                player2: {
                    inPlay: ['ancient-bear', 'niffle-ape', 'collector-worm'],
                    hand: ['gateway-to-dis', 'hypnobeam']
                }
            });
            this.collectorWorm.tokens.power = 10;
        });

        it('should enter play stunned', function () {
            this.player1.play(this.zorg);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.stunned).toBe(true);
        });

        it('should enter play stunned after being destroyed and played with Exhume', function () {
            this.player1.play(this.zorg);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.gatewayToDis);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.exhume);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.stunned).toBe(true);
        });

        it('should enter play stunned after taken control, being destroyed and played with Exhume', function () {
            this.player1.play(this.zorg);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt('Right');
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt("Remove this creature's stun");
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.threeFates);
            this.player1.clickCard(this.niffleApe);
            this.player1.clickCard(this.ancientBear);
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt('Done');
            expect(this.zorg.location).toBe('discard');
            this.player1.play(this.exhume);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.stunned).toBe(true);
        });
    });
});
