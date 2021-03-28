describe('Painmail', function () {
    describe("Painmail's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler'],
                    hand: ['painmail']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });
        });

        it('should return to owner archive and destroy friendly creature when opponent choose dis', function () {
            this.player1.playUpgrade(this.painmail, this.shooler);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.painmail.location).toBe('archives');
            expect(this.shooler.location).toBe('discard');
            expect(this.player1.player.archives).toContain(this.painmail);
            expect(this.painmail.parent).toBeNull();
        });

        it('should return to owner archive and destroy opponent creature when opponent choose dis', function () {
            this.player1.playUpgrade(this.painmail, this.gub);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.painmail.location).toBe('archives');
            expect(this.gub.location).toBe('discard');
            expect(this.player1.player.archives).toContain(this.painmail);
            expect(this.painmail.parent).toBeNull();
        });

        it('should return to owner archive and destroy creature when owner choose dis', function () {
            this.player1.playUpgrade(this.painmail, this.gub);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.painmail.parent).toBe(this.gub);
            expect(this.gub.location).toBe('play area');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.painmail.location).toBe('archives');
            expect(this.gub.location).toBe('discard');
            expect(this.player1.player.archives).toContain(this.painmail);
            expect(this.painmail.parent).toBeNull();
        });

        it('should archive Painmail and remove ward', function () {
            this.shooler.tokens.ward = true;
            this.player1.playUpgrade(this.painmail, this.shooler);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.painmail.location).toBe('archives');
            expect(this.shooler.location).toBe('play area');
            expect(this.shooler.tokens.ward).toBeUndefined();
            expect(this.player1.player.archives).toContain(this.painmail);
            expect(this.painmail.parent).toBeNull();
        });
    });
});
