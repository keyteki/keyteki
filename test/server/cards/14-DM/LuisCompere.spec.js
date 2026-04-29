describe('Luis Compere', function () {
    describe("Luis Compere's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['luis-compere']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('steals 2 when opponent draws 2 or more cards during their draw step', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
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
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when opponent has an empty deck and draws nothing', function () {
            for (const card of [...this.player2.player.deck]) {
                this.player2.moveCard(card, 'purged');
            }
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
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
                    inPlay: ['malifi-dragon']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
        });

        it('can resolve Luis Compere first, then Malifi Dragon', function () {
            this.player2.clickCard(this.luisCompere);
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can resolve Malifi Dragon first, then Luis Compere', function () {
            this.player2.clickCard(this.malifiDragon);
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Luis Compere with scrap-induced draws', function () {
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
            this.player2.clickPrompt('Autoresolve'); // Curse of Spontaneity
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Luis Compere with Punctuated Equilibrium', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['luis-compere']
                },
                player2: {
                    amber: 5,
                    hand: ['punctuated-equilibrium']
                }
            });
        });

        it('does not trigger when opponent refills via Punctuated Equilibrium', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
