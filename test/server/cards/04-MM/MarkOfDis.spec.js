describe('Mark of Dis', function () {
    describe("Mark of Dis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dodger', 'silvertooth', 'brammo', 'angwish'],
                    hand: ['mark-of-dis']
                },
                player2: {
                    inPlay: ['urchin', 'sneklifter', 'shadow-self'],
                    hand: ['shooler', 'hypnobeam'],
                    amber: 3
                }
            });
        });

        it('if own creature is destroyed, should not restrict house choice', function () {
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('discard');

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            expect(this.player1).toHavePromptButton('shadows');
        });

        it("if opponent's creature is destroyed, should not restrict opponent's house choice", function () {
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');

            this.player1.endTurn();

            expect(this.player2).toHavePromptButton('shadows');
        });

        it('if own creature is not destroyed, should restrict house choice', function () {
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.dodger);
            expect(this.dodger.damage).toBe(2);

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            expect(this.player1).not.toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('shadows');
        });

        it("if opponent's creature is not destroyed, should restrict opponent's house choice", function () {
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.sneklifter);

            expect(this.sneklifter.location).toBe('play area');
            expect(this.sneklifter.damage).toBe(0);
            expect(this.shadowSelf.damage).toBe(2);

            this.player1.endTurn();
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('shadows');
        });

        it('should restict house choice if target is warded', function () {
            this.urchin.ward();
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.warded).toBe(false);

            this.player1.endTurn();
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('shadows');
        });

        it('should not restrict house choice if not possible to choose that house', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);

            this.player2.clickCard(this.brammo);
            this.player2.clickPrompt('left');
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.brammo);
            this.player1.fightWith(this.angwish, this.brammo);
            this.player1.endTurn();

            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('mars');
            expect(this.player2).toHavePromptButton('shadows');
        });
    });

    describe("Mark of Dis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['mark-of-dis']
                },
                player2: {
                    hand: ['shooler', 'hypnobeam', 'gamgee'],
                    amber: 3
                }
            });
        });

        it('if no creature is in play, should not restrict house choice', function () {
            this.player1.play(this.markOfDis);
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('mars');
            expect(this.player2).toHavePromptButton('shadows');
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: ['mark-of-dis'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['mother']
                }
            });
            this.tachyonManifold.maverick = 'dis';
            this.tachyonManifold.printedHouse = 'dis';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.markOfDis);
            this.player1.clickCard(this.mother);
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('logos');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('untamed');
            this.player2.clickPrompt('logos');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
