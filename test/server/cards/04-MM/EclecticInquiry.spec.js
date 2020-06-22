describe('Eclectic Inquiry', function () {
    describe("Eclectic Inquiry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre', 'gub', 'eclectic-inquiry']
                },
                player2: {
                    inPlay: ['dodger']
                }
            });
        });

        it('should not archive any card if deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.play(this.eclecticInquiry);
            expect(this.player1.player.archives.length).toBe(0);
        });

        it('should archive one card if deck has a solo card', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.gub, 'deck');
            this.player1.play(this.eclecticInquiry);
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.gub.location).toBe('archives');
        });

        it('should archive two cards if deck has many cards', function () {
            this.player1.moveCard(this.gub, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.eclecticInquiry);
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.dextre.location).toBe('archives');
            expect(this.gub.location).toBe('archives');
        });
    });
});
