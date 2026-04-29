describe('Luis Compere', function () {
    describe("Luis Compere's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['luis-compere']
                },
                player2: {
                    amber: 5,
                    deck: ['troll', 'krump', 'bumpsy', 'urchin', 'hobnobber', 'lamindra']
                }
            });
        });

        it('steals 2 when opponent draws 2 or more cards during their draw step', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when opponent draws fewer than 2 cards during their draw step', function () {
            this.player2.player.hand = this.player2.player.hand.concat(
                this.player2.player.deck.slice(0, 5)
            );
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when opponent has an empty deck and draws nothing', function () {
            // Purge opponent's whole deck so refill cannot draw any cards
            for (const card of [...this.player2.player.deck]) {
                this.player2.moveCard(card, 'purged');
            }
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Luis Compere ordering with other end-of-turn interrupts', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['luis-compere']
                },
                player2: {
                    amber: 3,
                    inPlay: ['malifi-dragon'],
                    deck: ['troll', 'krump', 'bumpsy', 'urchin', 'hobnobber', 'lamindra']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
        });

        // Two end-of-turn interrupts trigger simultaneously:
        // - Malifi Dragon (player2): gain 2A if at 4 or fewer
        // - Luis Compere (player1): steal 2A (requires opponent to have amber)
        // The active player (player2) orders interrupts.

        it('can resolve Luis Compere first, then Malifi Dragon', function () {
            this.player2.clickCard(this.luisCompere);
            this.player1.clickPrompt('shadows');
            // LC steals 2A → p1: 2, p2: 1. Malifi triggers (1 <= 4) → p2 gains 2 → p2: 3.
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can resolve Malifi Dragon first, then Luis Compere', function () {
            this.player2.clickCard(this.malifiDragon);
            this.player1.clickPrompt('shadows');
            // Malifi gains 2A → p2: 5. LC steals 2A → p1: 2, p2: 3.
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Luis Compere with scrap-induced draws', function () {
        // 6 Ven-Omawks reduce opponent's hand-size refill to 0, so the draw step
        // would normally draw nothing. Curse of Spontaneity discards player2's
        // hand at the start of their draw step, scrapping any Brillix Ponders
        // they were holding. Each Brillix Ponder scraps for a single card draw
        // during the draw phase, so 2 of them produce 2 single draws — enough
        // to trigger Luis Compere.
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: [
                        'luis-compere',
                        'ven-omawk',
                        'ven-omawk',
                        'ven-omawk',
                        'ven-omawk',
                        'ven-omawk',
                        'ven-omawk'
                    ]
                },
                player2: {
                    amber: 5,
                    inPlay: ['curse-of-spontaneity'],
                    hand: ['brillix-ponder', 'brillix-ponder']
                }
            });
        });

        it('triggers when 2 Brillix Ponder scrap-draws occur during the draw step', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            // Curse of Spontaneity asks player2 to order their hand discards.
            this.player2.clickPrompt('Autoresolve');
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
