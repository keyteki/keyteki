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

    describe('with multiple Painmails', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler'],
                    hand: ['painmail', 'painmail']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
            this.painmail0 = this.player1.hand[0];
            this.painmail1 = this.player1.hand[1];
        });

        it('should allow choosing which Painmail to trigger first', function () {
            this.player1.playUpgrade(this.painmail0, this.shooler);
            this.player1.playUpgrade(this.painmail1, this.shooler);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            // Prompt to choose between the two Painmails
            expect(this.player2.currentPrompt().buttons[0].values.card).toBe('Painmail');
            expect(this.player2.currentPrompt().buttons[1].values.card).toBe('Painmail');
            expect(this.player2.currentPrompt().buttons[2].text).toBe('Autoresolve');
            this.player2.clickPrompt('Painmail', 1);
            expect(this.player1.player.archives).toContain(this.painmail1);
            expect(this.painmail0.location).toBe('discard');
            expect(this.shooler.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
