describe('Mookling Evil Twin', function () {
    describe("Mookling's evil twin", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['murmook', 'titan-mechanic'],
                    amber: 1,
                    inPlay: ['mookling-evil-twin']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('not impact owner ameber when forging', function () {
            this.player1.amber = 7;
            expect(this.player1.amber).toBe(7);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(1);
        });

        it('not impact opponent ameber when forging', function () {
            this.player2.amber = 7;
            expect(this.player2.amber).toBe(7);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(1);
        });

        it('should not gain power when owner forges', function () {
            this.player1.amber = 7;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.mooklingEvilTwin.powerCounters).toBe(0);
        });

        it('should gain power when opponent forges', function () {
            expect(this.mooklingEvilTwin.powerCounters).toBe(0);
            this.player2.amber = 7;
            expect(this.player2.amber).toBe(7);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(1);
            expect(this.mooklingEvilTwin.powerCounters).toBe(6);
        });

        it('should gain less power if the key is less expensive', function () {
            expect(this.mooklingEvilTwin.powerCounters).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.play(this.titanMechanic);

            this.player2.amber = 5;
            expect(this.player2.amber).toBe(5);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(0);
            expect(this.mooklingEvilTwin.powerCounters).toBe(5);
        });

        it('should gain extra power if the key is more expensive', function () {
            expect(this.mooklingEvilTwin.powerCounters).toBe(0);
            this.player1.play(this.murmook);
            this.player2.amber = 7;
            expect(this.player2.amber).toBe(7);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(0);
            expect(this.mooklingEvilTwin.powerCounters).toBe(7);
        });
    });
});
