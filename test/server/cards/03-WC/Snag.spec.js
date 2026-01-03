describe('Snag', function () {
    describe('fight ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['snag']
                },
                player2: {
                    inPlay: ['urchin', 'dextre', 'grumpus:archimedes', 'troll'],
                    token: 'grumpus',
                    hand: ['academy-training', 'experimental-therapy']
                }
            });
        });

        describe('when snag fights a "plain" creature', function () {
            beforeEach(function () {
                this.player1.fightWith(this.snag, this.urchin);
                this.player1.endTurn();
            });

            it('should restrict the house choice to the house of the creature fought', function () {
                expect(this.player2).toHavePrompt('House Choice');
                expect(this.player2).not.toHavePromptButton('logos');
                expect(this.player2).toHavePromptButton('shadows');
                expect(this.player2).not.toHavePromptButton('brobnar');
            });

            describe('when the next turn for player 2 starts', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();

                    this.player1.clickPrompt('dis');
                    this.player1.endTurn();
                });

                it('should not restrict the house choice', function () {
                    expect(this.player2).toHavePromptButton('logos');
                    expect(this.player2).toHavePromptButton('shadows');
                    expect(this.player2).toHavePromptButton('brobnar');
                });
            });
        });

        describe('when fighting a creature with a changed house', function () {
            beforeEach(function () {
                this.player1.endTurn();

                this.player2.clickPrompt('logos');
                this.player2.playUpgrade(this.academyTraining, this.urchin);
                this.player2.endTurn();

                this.player1.clickPrompt('dis');
                this.player1.fightWith(this.snag, this.urchin);
                this.player1.endTurn();
            });

            it('should restrict the house choice to the overridden house of the fought creature', function () {
                expect(this.player2).toHavePromptButton('logos');
                expect(this.player2).not.toHavePromptButton('shadows');
                expect(this.player2).not.toHavePromptButton('brobnar');
            });
        });

        describe('when fighting a token creature', function () {
            beforeEach(function () {
                this.player1.fightWith(this.snag, this.grumpus);
                this.player1.endTurn();
            });

            it('should restrict the house choice to the overridden house of the fought creature', function () {
                expect(this.player2).not.toHavePromptButton('logos');
                expect(this.player2).not.toHavePromptButton('shadows');
                expect(this.player2).toHavePromptButton('brobnar');
            });
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'snag']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['batdrone', 'shaffles', 'dust-pixie']
                }
            });
            this.tachyonManifold.maverick = 'dis';
            this.tachyonManifold.printedHouse = 'dis';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.fightWith(this.snag, this.batdrone);
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('logos');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('untamed');
            this.player2.clickPrompt('logos');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
