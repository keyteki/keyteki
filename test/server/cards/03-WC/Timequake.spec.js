describe('Timequake', function () {
    describe("Timequake's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: ['lamindra', 'alaka', 'orb-of-wonder'],
                    hand: ['timequake', 'troll', 'blood-of-titans']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bulwark'],
                    hand: ['bonerot-venom', 'murkens']
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
            expect(this.bulwark.location).toBe('play area');
            expect(this.lamindra.location).not.toBe('play area');
            expect(this.alaka.location).not.toBe('play area');
            expect(this.orbOfWonder.location).not.toBe('play area');
        });

        it('should not draw any card if nothing is in play', function () {
            this.player1.moveCard(this.lamindra, 'discard');
            this.player1.moveCard(this.orbOfWonder, 'discard');
            this.player1.moveCard(this.alaka, 'discard');
            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(2);
        });

        it('should consider warded cards', function () {
            this.lamindra.ward();
            expect(this.player1.player.cardsInPlay.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(1);
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.lamindra.location).toBe('play area');
            expect(this.alaka.location).not.toBe('play area');
            expect(this.orbOfWonder.location).not.toBe('play area');
        });

        it('should not count cards under other cards', function () {
            this.player1.player.removeCardFromPile(this.lamindra);
            this.player1.player.removeCardFromPile(this.alaka);

            this.lamindra.parent = this.orbOfWonder;
            this.lamindra.facedown = true;
            this.orbOfWonder.childCards.push(this.lamindra);

            this.alaka.parent = this.orbOfWonder;
            this.alaka.facedown = false;
            this.orbOfWonder.childCards.push(this.alaka);

            expect(this.player1.player.cardsInPlay.length).toBe(1);
            expect(this.player1.player.hand.length).toBe(3);

            this.player1.play(this.timequake);

            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(3);

            expect(this.lamindra.location).toBe('discard');
            expect(this.alaka.location).toBe('discard');
            expect(this.orbOfWonder.location).not.toBe('play area');
        });

        it('should shuffle upgrade before creatures', function () {
            // Play the upgrade
            this.player1.playUpgrade(this.bloodOfTitans, this.lamindra);
            expect(this.player1.player.cardsInPlay.length).toBe(3);

            expect(this.player1.player.hand.length).toBe(2);

            this.player1.play(this.timequake);

            // Upgrade should not be in discard
            expect(this.bloodOfTitans.location).not.toBe('discard');
            expect(this.player1.player.hand.length).toBe(5);
        });

        it('should shuffle friendly upgrades attached to enemy creatures', function () {
            // Play the upgrade
            this.player1.playUpgrade(this.bloodOfTitans, this.bulwark);
            expect(this.player1.player.cardsInPlay.length).toBe(3);

            expect(this.player1.player.hand.length).toBe(2);

            this.player1.play(this.timequake);

            // Upgrade should not be in discard
            expect(this.bulwark.upgrades.length).toBe(0);
            expect(this.bloodOfTitans.location).not.toBe('discard');
            expect(this.player1.player.hand.length).toBe(5);
        });

        it('opponent will attach its upgrade on my creature, timequake should not count it to draw', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playUpgrade(this.bonerotVenom, this.lamindra);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            expect(this.player1.player.hand.length).toBe(6);

            this.player1.play(this.timequake);

            // Opponent's upgrade should go to discard
            expect(this.bonerotVenom.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(8);
        });

        it('opponent will play timequake from my archive using murkens', function () {
            expect(this.player2.player.hand.length).toBe(2);

            this.player1.moveCard(this.timequake, 'archives');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playUpgrade(this.bonerotVenom, this.lamindra);
            this.player2.play(this.murkens);
            this.player2.clickPrompt('Random card from archives');

            expect(this.lamindra.upgrades.length).toBe(0);
            expect(this.bonerotVenom.location).not.toBe('discard');
            expect(this.murkens.location).not.toBe('discard');
            expect(this.bulwark.location).not.toBe('discard');
            expect(this.player2.player.hand.length).toBe(3);
        });

        it('opponent will murkens my upgrade and timequake should not move it to deck', function () {
            this.player1.moveCard(this.bloodOfTitans, 'archives');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.murkens);
            this.player2.clickPrompt('Random card from archives');
            this.player2.clickCard(this.bulwark);
            expect(this.bulwark.upgrades).toContain(this.bloodOfTitans);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.player1.player.hand.length).toBe(6);
            this.player1.play(this.timequake);

            expect(this.bulwark.upgrades).toContain(this.bloodOfTitans);
            expect(this.bulwark.location).toBe('play area');
            expect(this.lamindra.location).not.toBe('play area');
            expect(this.alaka.location).not.toBe('play area');
            expect(this.orbOfWonder.location).not.toBe('play area');
            expect(this.player1.player.hand.length).toBe(8);
        });
    });
});
