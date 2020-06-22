describe('Word of Returning', function () {
    describe("Word of Returning's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['silvertooth'],
                    hand: ['word-of-returning']
                },
                player2: {
                    inPlay: ['dextre', 'sequis', 'mother'],
                    hand: ['praefectus-ludo']
                }
            });
            this.silvertooth.addToken('amber');
            this.dextre.addToken('amber');
            this.sequis.addToken('amber', 4);
        });

        it('should deal a damage to each enemy unit for each amber they have, and take all amber', function () {
            this.player1.play(this.wordOfReturning);
            expect(this.dextre.tokens.damage).toBe(1);
            expect(this.mother.hasToken('damage')).toBe(false);
            expect(this.sequis.tokens.damage).toBe(2);
            expect(this.dextre.hasToken('amber')).toBe(false);
            expect(this.sequis.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(6);
        });
    });
    describe("Word of Returning's ability with ludo in play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['silvertooth'],
                    hand: ['word-of-returning']
                },
                player2: {
                    inPlay: ['helper-bot', 'sequis', 'praefectus-ludo']
                }
            });
            this.helperBot.addToken('amber', 10);
            this.sequis.addToken('amber', 4);
            this.player1.play(this.wordOfReturning);
        });

        it('should deal a damage to each enemy unit for each amber they have, and take all amber', function () {
            expect(this.helperBot.location).toBe('discard');
            expect(this.praefectusLudo.location).toBe('play area');
            expect(this.sequis.tokens.damage).toBe(2);
            expect(this.sequis.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(5);
        });
    });
    describe("Word of Returning's ability with shadow self and ether spider", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['silvertooth'],
                    hand: ['word-of-returning']
                },
                player2: {
                    inPlay: ['helper-bot', 'shadow-self', 'ether-spider']
                }
            });
            this.etherSpider.addToken('amber', 9);
            this.player1.play(this.wordOfReturning);
        });
        it('should leave a on ether spider and destroy shadow self', function () {
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.etherSpider.location).toBe('play area');
            expect(this.etherSpider.tokens.amber).toBe(10);
            expect(this.player1.amber).toBe(0);
        });
    });
});
