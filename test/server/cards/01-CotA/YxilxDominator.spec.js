describe('Yxilx Dominator', function () {
    describe("Yxilx Dominator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['yxilx-dominator', 'exhume', 'three-fates', 'key-abduction']
                },
                player2: {
                    inPlay: ['ancient-bear', 'niffle-ape'],
                    hand: ['gateway-to-dis', 'hypnobeam']
                }
            });
        });

        it('should enter play stunned', function () {
            this.player1.play(this.yxilxDominator);
            expect(this.yxilxDominator.location).toBe('play area');
            expect(this.yxilxDominator.stunned).toBe(true);
        });

        it('should enter play stunned after being destroyed and played with Exhume', function () {
            this.player1.play(this.yxilxDominator);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.gatewayToDis);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.exhume);
            this.player1.clickCard(this.yxilxDominator);
            expect(this.yxilxDominator.location).toBe('play area');
            expect(this.yxilxDominator.stunned).toBe(true);
        });

        it('should enter play stunned after taken control, being destroyed and played with Exhume', function () {
            this.player1.play(this.yxilxDominator);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.yxilxDominator);
            this.player2.clickPrompt('Right');
            this.player2.clickCard(this.yxilxDominator);
            this.player2.clickPrompt("Remove this creature's stun");
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.threeFates);
            this.player1.clickCard(this.niffleApe);
            this.player1.clickCard(this.ancientBear);
            this.player1.clickCard(this.yxilxDominator);
            this.player1.clickPrompt('Done');
            expect(this.yxilxDominator.location).toBe('discard');
            this.player1.play(this.exhume);
            this.player1.clickCard(this.yxilxDominator);
            expect(this.yxilxDominator.location).toBe('play area');
            expect(this.yxilxDominator.stunned).toBe(true);
        });

        it('should enter play stunned after taken control, moved back to hand and played again', function () {
            this.player1.play(this.yxilxDominator);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.yxilxDominator);
            this.player2.clickPrompt('Right');
            this.player2.clickCard(this.yxilxDominator);
            this.player2.clickPrompt("Remove this creature's stun");
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.keyAbduction);
            this.player1.play(this.yxilxDominator);
            expect(this.yxilxDominator.location).toBe('play area');
            expect(this.yxilxDominator.stunned).toBe(true);
        });
    });
});
