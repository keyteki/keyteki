describe('Academy Training', function () {
    describe("Academy Training's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['eyegor', 'rustgnawer'],
                    hand: ['academy-training']
                },
                player2: {
                    amber: 4,
                    inPlay: ['archimedes'],
                    hand: ['urchin', 'dextre', 'harland-mindlock']
                }
            });
        });

        it('should treat the upgraded creature as Logos, but not its original house', function () {
            this.player1.playUpgrade(this.academyTraining, this.rustgnawer);
            expect(this.rustgnawer.hasHouse('logos')).toBe(true);
            expect(this.rustgnawer.hasHouse('untamed')).toBe(false);
            this.player1.reap(this.rustgnawer);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.rustgnawer.hasHouse('logos')).toBe(true);
            expect(this.rustgnawer.hasHouse('untamed')).toBe(false);
            this.player1.clickCard(this.rustgnawer);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1.amber).toBe(1);
        });

        it("should add the 'draw a card' effect to reaping", function () {
            this.player1.playUpgrade(this.academyTraining, this.rustgnawer);
            expect(this.player1.hand.length).toBe(0);
            this.player1.reap(this.rustgnawer);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.hand.length).toBe(1);
        });

        it('should not be logos if opponent takes control', function () {
            this.player1.playUpgrade(this.academyTraining, this.rustgnawer);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playCreature(this.harlandMindlock);
            this.player2.clickCard(this.rustgnawer);
            this.player2.clickPrompt('Left');
            this.player2.clickCard(this.rustgnawer);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
        });
    });
});
