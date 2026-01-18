describe('Lifeward', function () {
    describe("Lifeward's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lifeward']
                },
                player2: {
                    inPlay: [],
                    hand: ['troll', 'gauntlet-of-command', 'wild-wormhole']
                }
            });
        });

        it('should stop their opponent playing creatures', function () {
            this.player1.clickCard(this.lifeward);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.lifeward.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).toHavePrompt('Troll');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.player2).toHavePrompt('Gauntlet of Command');
            expect(this.player2).toHavePromptButton('Play this artifact');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
        });

        it('should stop wild wormhole from playing creatures', function () {
            this.player1.clickCard(this.lifeward);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.lifeward.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.moveCard(this.troll, 'deck');
            expect(this.troll.location).toBe('deck');
            this.player2.play(this.wildWormhole);
            expect(this.troll.location).toBe('deck');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow wild wormhole to play artifacts', function () {
            this.player1.clickCard(this.lifeward);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.lifeward.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.moveCard(this.gauntletOfCommand, 'deck');
            expect(this.gauntletOfCommand.location).toBe('deck');
            this.player2.play(this.wildWormhole);
            expect(this.gauntletOfCommand.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'lifeward']
                },
                player2: {
                    amber: 0,
                    inPlay: [],
                    hand: ['shaffles']
                }
            });
            this.tachyonManifold.maverick = 'dis';
            this.tachyonManifold.printedHouse = 'dis';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.clickCard(this.lifeward);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.shaffles);
            expect(this.player2).toHavePrompt('Shaffles');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
