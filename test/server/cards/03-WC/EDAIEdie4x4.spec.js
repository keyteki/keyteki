describe('EDAI Edie 4x4', function () {
    describe("EDAI Edie 4x4's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['mother'],
                    hand: ['archimedes', 'edai-edie-4x4']
                },
                player2: {
                    amber: 4,
                    hand: ['urchin']
                }
            });
        });

        it('should allow you to archive a card when played', function () {
            this.player1.play(this.edaiEdie4x4);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.edaiEdie4x4);
            this.player1.clickCard(this.archimedes);
            expect(this.edaiEdie4x4.location).toBe('play area');
            expect(this.archimedes.location).toBe('archives');
        });
    });

    describe("EDAI Edie 4x4's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 8,
                    house: 'logos',
                    inPlay: ['edai-edie-4x4'],
                    archives: ['archimedes', 'imprinted-murmook']
                },
                player2: {
                    amber: 10,
                    archives: ['dextre', 'flaxia'],
                    hand: ['mimic-gel']
                }
            });
        });

        it("should increase the cost of opponent's keys by 1 for each archived card.", function () {
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.player.amber).toBe(2);
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.amber).toBe(2);
        });
    });

    describe("EDAI Edie 4x4 and Mimic Gel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 12,
                    house: 'logos',
                    inPlay: ['flaxia', 'edai-edie-4x4'],
                    archives: ['archimedes', 'imprinted-murmook', 'bumblebird']
                },
                player2: {
                    amber: 1,
                    archives: ['dextre'],
                    hand: ['mimic-gel', 'foggify', 'harland-mindlock']
                }
            });
        });

        it("should increase the cost of opponent's keys when Mimic Gel is played.", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');
            this.player2.play(this.mimicGel);
            this.player2.clickCard(this.edaiEdie4x4);
            this.player2.clickCard(this.foggify);
            expect(this.player2.player.archives.length).toBe(2);
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.amber).toBe(4);
        });

        it("should increase the cost of opponent's keys when Mimic Gel is played on controlled Edai.", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');
            this.player2.play(this.harlandMindlock);
            this.player2.clickCard(this.edaiEdie4x4);
            this.player2.clickPrompt('Left');
            this.player2.play(this.mimicGel);
            this.player2.clickCard(this.edaiEdie4x4);
            this.player2.clickCard(this.foggify);
            expect(this.player2.player.archives.length).toBe(2);
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.amber).toBe(2);
        });
    });
});
