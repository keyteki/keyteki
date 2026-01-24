describe('Grommid', function () {
    describe("Grommid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['grommid'],
                    hand: ['zorg', 'commpod', 'biomatrix-backup', 'carpet-phloxem']
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'mega-narp', 'bad-penny']
                }
            });

            this.megaNarp.tokens.damage = 1;
        });

        it('should be able to play actions/artifacts/upgrades, but not creatures', function () {
            this.player1.play(this.carpetPhloxem);
            this.player1.play(this.commpod);
            this.player1.playUpgrade(this.biomatrixBackup, this.grommid);
            this.player1.clickCard(this.zorg);
            expect(this.player1).not.toHavePrompt('Play this creature');
            this.player1.clickPrompt('Discard this card');
            expect(this.zorg.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should cause the controller of a creature it attacks to lose an amber when it lives and the opponent dies', function () {
            this.player1.fightWith(this.grommid, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.grommid.damage).toBe(5);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should cause the controller of a creature it attacks to lose an amber when it lives and the opponent has a destroyed effect', function () {
            this.player1.fightWith(this.grommid, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.grommid.damage).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should not cause the controller of a creature it attacks to lose an amber when it lives and the opponent is warded', function () {
            this.docBookton.ward();
            this.player1.fightWith(this.grommid, this.docBookton);
            expect(this.docBookton.location).toBe('play area');
            expect(this.docBookton.warded).toBe(false);
            expect(this.grommid.damage).toBe(5);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should not cause the controller of a creature it attacks to lose an amber when they both die', function () {
            this.player1.fightWith(this.grommid, this.megaNarp);
            expect(this.megaNarp.location).toBe('discard');
            expect(this.grommid.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should cause the controller of a creature attacking it to lose an amber when it lives and the opponent dies', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.docBookton, this.grommid);
            expect(this.docBookton.location).toBe('discard');
            expect(this.grommid.damage).toBe(5);
            expect(this.player2.amber).toBe(2);
            this.player2.endTurn();
        });

        it('should not cause the controller of a creature attacking it to lose an amber when they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.megaNarp, this.grommid);
            expect(this.megaNarp.location).toBe('discard');
            expect(this.grommid.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player2.endTurn();
        });
    });
});
