describe('Rage Reset', function () {
    describe("Rage Reset's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['rage-reset', 'poke', 'timetraveller'],
                    inPlay: ['dextre', 'troll', 'krump']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ancient-bear'],
                    hand: [
                        'dust-pixie',
                        'hunting-witch',
                        'punctuated-equilibrium',
                        'toad',
                        'prince-bufo'
                    ]
                }
            });
        });

        it('should destroy friendly creatures and draw cards', function () {
            this.player1.play(this.rageReset);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.dextre.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(4); // Drew 2 cards
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not draw for warded creatures', function () {
            this.troll.ward();
            this.player1.play(this.rageReset);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.warded).toBe(false);
            expect(this.dextre.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(3); // Drew 1 card
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow destroying no creatures', function () {
            this.player1.play(this.rageReset);
            this.player1.clickPrompt('Done');
            expect(this.dextre.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(2); // No cards drawn
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard half of hand when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.rageReset);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.ancientBear);
            expect(this.player2.player.hand.length).toBe(3); // Discarded 2 cards (half of 5 rounded down)
            expect(this.rageReset.location).toBe('discard');
            expect(this.player2.player.discard.length).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
