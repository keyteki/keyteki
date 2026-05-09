describe('Zorg', function () {
    describe("Zorg's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'exhume', 'three-fates', 'key-abduction']
                },
                player2: {
                    inPlay: ['ancient-bear', 'duskwitch', 'niffle-ape'],
                    hand: ['gateway-to-dis', 'hypnobeam']
                }
            });
        });

        it('should enter play stunned', function () {
            this.player1.play(this.zorg);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.stunned).toBe(true);
        });

        it('when fighting, should stun creatures neighbors', function () {
            this.player1.play(this.zorg);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.zorg.unstun();
            this.player1.fightWith(this.zorg, this.duskwitch);
            expect(this.zorg.damage).toBe(0);
            expect(this.duskwitch.stunned).toBe(true);
            expect(this.niffleApe.stunned).toBe(true);
            expect(this.ancientBear.stunned).toBe(true);
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

        it('should enter play stunned after taken control, moved back to hand and played again', function () {
            this.player1.play(this.zorg);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt('Right');
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt("Remove this creature's stun");
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.keyAbduction);
            this.player1.play(this.zorg);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.stunned).toBe(true);
        });
    });
});
