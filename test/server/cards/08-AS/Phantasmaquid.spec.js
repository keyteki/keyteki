describe('Phantasmaquid', function () {
    describe("Phantasmaquid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['phantasmaquid'],
                    hand: ['shooler']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    hand: ['ancient-bear', 'deepwood-druid', 'final-refrain'],
                    discard: ['troll']
                }
            });
        });

        it('should prevent opponent from playing creatures on the right', function () {
            this.player1.playCreature(this.shooler, false);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.ancientBear);
            this.player2.clickPrompt('Play this creature');
            expect(this.player2).toHavePromptButton('Left');
            expect(this.player2).not.toHavePromptButton('Right');
            this.player2.clickPrompt('Left');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent opponent from deploying creatures on the right when not on right flank', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.ancientBear, true);
            this.player2.clickCard(this.deepwoodDruid);
            this.player2.clickPrompt('Play this creature');
            expect(this.player2).toHavePromptButton('Left');
            expect(this.player2).toHavePromptButton('Deploy Left');
            expect(this.player2).toHavePromptButton('Deploy Right');
            expect(this.player2).not.toHavePromptButton('Right');
            this.player2.clickPrompt('Deploy Right');
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.ancientBear);
            this.player2.clickCard(this.ancientBear);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent opponent from putting creatures into play on the right flank', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.finalRefrain);
            expect(this.player2).toHavePromptButton('Left');
            expect(this.player2).toHavePromptButton('Right');
            this.player2.clickPrompt('Right');
            this.player2.clickCard(this.phantasmaquid);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should prevent opponent from putting creatures into play at all if they have no creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.dustPixie, this.phantasmaquid);
            this.player2.clickCard(this.ancientBear);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should be destroyed at end of turn if no creatures in play', function () {
            this.player1.fightWith(this.phantasmaquid, this.dustPixie);
            this.player1.endTurn();
            expect(this.phantasmaquid.location).toBe('discard');
        });
    });
});
