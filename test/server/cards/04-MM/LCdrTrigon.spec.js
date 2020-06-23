describe('LCdr. Trigon', function () {
    describe("LCdr. Trigon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['troll', 'lcdr-trigon'],
                    hand: ['medic-ingram', 'mab-the-mad']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone', 'bot-bookton']
                }
            });
        });

        it('should not resolve any card with an empty deck', function () {
            this.player1.player.deck = [];
            this.player1.reap(this.lcdrTrigon);
            expect(this.player1.amber).toBe(2);
        });

        it('should discard troll and resolve its bonus icon (none)', function () {
            this.player1.moveCard(this.troll, 'deck');
            this.player1.reap(this.lcdrTrigon);
            expect(this.player1.amber).toBe(2);
            expect(this.troll.location).toBe('discard');
        });

        it('should discard Mab the Mad and resolve its bonus icon (1A)', function () {
            this.player1.moveCard(this.mabTheMad, 'deck');
            this.player1.reap(this.lcdrTrigon);
            expect(this.player1.amber).toBe(3);
            expect(this.mabTheMad.location).toBe('discard');
        });

        it('should discard Mab the Mad and resolve its bonus icon (2A + 1D + 1C)', function () {
            this.mabTheMad.cardData.enhancements = ['amber', 'draw', 'capture'];
            this.player1.moveCard(this.mabTheMad, 'deck');
            this.player1.reap(this.lcdrTrigon);
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(4);
            expect(this.troll.amber).toBe(1);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.mabTheMad.location).toBe('discard');
        });
    });
});
