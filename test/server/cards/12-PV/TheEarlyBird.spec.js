describe('The Early Bird', function () {
    describe("The Early Bird's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    prophecies: [
                        'the-early-bird',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should fulfill when opponent has more amber at end of their turn', function () {
            this.player1.activateProphecy(this.theEarlyBird, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.player1.clickPrompt('dis');
        });

        it('should not fulfill when opponent has less amber at end of their turn', function () {
            this.player1.activateProphecy(this.theEarlyBird, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.amber = 2;
            this.player2.endTurn();
            expect(this.parasiticArachnoid.location).toBe('under');
            this.player1.clickPrompt('dis');
        });
    });

    describe('The Early Bird and another end of turn ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shaffles']
                },
                player2: {
                    house: 'shadows',
                    prophecies: [
                        'the-early-bird',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid', 'urchin']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.activateProphecy(this.theEarlyBird, this.parasiticArachnoid);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.amber = 2;
            this.player2.amber = 2;
        });

        it('does not fulfill if resolved before Shaffles makes the opponent lose amber', function () {
            this.player1.endTurn();
            this.player1.clickPrompt('The Early Bird');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });

        it('fulfills if resolved after Shaffles makes the opponent lose amber', function () {
            this.player1.endTurn();
            this.player1.clickPrompt('Shaffles');
            // Parasitic Arachnoid's fate
            this.player1.clickCard(this.shaffles);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.shaffles.amber).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });

        it('auto-resolves both abilities when orderForcedAbilities is disabled', function () {
            this.player1.player.optionSettings.orderForcedAbilities = false;
            this.player1.endTurn();
            // In queue order The Early Bird resolves first, while amber is still equal
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
