describe('Timequake', function () {
    describe("Timequake's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: ['lamindra', 'murkens', 'orb-of-wonder'],
                    hand: ['timequake', 'troll', 'blood-of-titans']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bulwark']
                }
            });
        });

        it('should return 3 cards in play to deck and draw 3 cards', function () {
            expect(this.player1.player.cardsInPlay.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(0);
            // 3 initial cards - 1 played + 3 drawn
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.lamindra.location).not.toBe('play area');
            expect(this.murkens.location).not.toBe('play area');
            expect(this.orbOfWonder.location).not.toBe('play area');
        });

        it('should not draw any card if nothing is in play', function () {
            this.player1.moveCard(this.lamindra, 'discard');
            this.player1.moveCard(this.orbOfWonder, 'discard');
            this.player1.moveCard(this.murkens, 'discard');
            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(2);
        });

        it('should consider warded cards', function () {
            this.lamindra.tokens.ward = 1;
            expect(this.player1.player.cardsInPlay.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(1);
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).not.toBe('play area');
            expect(this.orbOfWonder.location).not.toBe('play area');
        });

        it('should not count cards under other cards', function () {
            this.player1.player.removeCardFromPile(this.lamindra);
            this.player1.player.removeCardFromPile(this.murkens);

            this.lamindra.parent = this.orbOfWonder;
            this.lamindra.facedown = true;
            this.orbOfWonder.childCards.push(this.lamindra);

            this.murkens.parent = this.orbOfWonder;
            this.murkens.facedown = false;
            this.orbOfWonder.childCards.push(this.murkens);

            expect(this.player1.player.cardsInPlay.length).toBe(1);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(3);

            expect(this.lamindra.location).toBe('discard');
            expect(this.murkens.location).toBe('discard');
            expect(this.orbOfWonder.location).not.toBe('play area');
        });

        it('should shuffle upgrade before creatures', function () {
            // Play the upgrade
            this.player1.playUpgrade(this.bloodOfTitans, this.lamindra);
            expect(this.player1.player.cardsInPlay.length).toBe(3);
            expect(this.lamindra.upgrades).toContain(this.bloodOfTitans);

            expect(this.player1.player.hand.length).toBe(2);

            this.player1.play(this.timequake);

            // Upgrade should not be in discard
            expect(this.bloodOfTitans.location).not.toBe('discard');
            expect(this.player1.player.hand.length).toBe(5);
        });
    });
});
