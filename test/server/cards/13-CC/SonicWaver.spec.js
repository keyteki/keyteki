describe('Sonic Waver', function () {
    describe("Sonic Waver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['sonic-waver', 'blypyp', 'shorty'],
                    inPlay: ['troll', 'dust-pixie']
                },
                player2: {
                    inPlay: ['culf-the-quiet', 'witch-of-the-eye'],
                    hand: ['krump']
                }
            });
        });

        it('should stun a creature when played', function () {
            this.player1.play(this.sonicWaver);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make opponent non-Mars creatures enter play stunned', function () {
            this.player1.play(this.sonicWaver);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.krump);
            expect(this.krump.stunned).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should make own non-Mars creatures enter play stunned', function () {
            this.player1.play(this.sonicWaver);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.playCreature(this.shorty);
            expect(this.shorty.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not make Mars creatures enter play stunned', function () {
            this.player1.play(this.sonicWaver);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.playCreature(this.blypyp);
            expect(this.blypyp.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should purge itself at end of turn if no creatures are stunned', function () {
            this.player1.play(this.sonicWaver);
            this.player1.clickCard(this.culfTheQuiet);
            this.culfTheQuiet.unstun();
            this.player1.endTurn();
            expect(this.sonicWaver.location).toBe('purged');
        });

        it('should purge itself at opponent end of turn if no creatures are stunned', function () {
            this.player1.play(this.sonicWaver);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.endTurn();
            expect(this.sonicWaver.location).toBe('play area');
            this.player2.clickPrompt('brobnar');
            this.culfTheQuiet.unstun();
            this.player2.endTurn();
            expect(this.sonicWaver.location).toBe('purged');
        });

        it('should not purge itself at opponent end of turn if there are stunned creatures', function () {
            this.player1.play(this.sonicWaver);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.sonicWaver.location).toBe('play area');
        });
    });
});
