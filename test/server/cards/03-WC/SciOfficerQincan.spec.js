describe('Sci. Officer Qincan', function () {
    describe("Sci. Officer Qincan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'staralliance',
                    inPlay: ['ancient-bear'],
                    hand: ['sci-officer-qincan', 'blood-of-titans']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mighty-tiger'],
                    hand: ['dextre', 'krump']
                }
            });

            this.player1.play(this.sciOfficerQincan);
        });

        it('should steal an amber if player chooses a house not in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Logos');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('should not steal an amber if player chooses a house in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
        });

        it('should apply to both players', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);

            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('should consider upgrades', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            this.player1.playUpgrade(this.bloodOfTitans, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            this.player2.endTurn();
        });
    });
});
