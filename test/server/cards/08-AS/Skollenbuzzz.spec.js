describe('Skollenbuzzz', function () {
    describe("Skollenbuzzz's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: [`skŏllĕnbŭzzz`, 'blypyp', 'charette', 'hire-on'],
                    inPlay: ['shooler']
                },
                player2: {
                    amber: 4,
                    hand: ['krump', 'hypnobeam', 'kaboom'],
                    inPlay: ['troll']
                }
            });
        });

        it('should allow putting a creature from hand under it on play', function () {
            this.player1.playCreature(this.skŏllĕnbŭzzz);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.hireOn);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.blypyp);
            expect(this.blypyp.location).toBe('under');
            expect(this.skŏllĕnbŭzzz.childCards).toContain(this.blypyp);
            expect(this.skŏllĕnbŭzzz.childCards.length).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be optional', function () {
            this.player1.playCreature(this.skŏllĕnbŭzzz);
            this.player1.clickPrompt('Done');
            expect(this.blypyp.location).toBe('hand');
            expect(this.charette.location).toBe('hand');
            expect(this.skŏllĕnbŭzzz.childCards.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow putting a creature from hand under it on reap', function () {
            this.player1.playCreature(this.skŏllĕnbŭzzz);
            this.player1.clickCard(this.blypyp);
            this.skŏllĕnbŭzzz.exhausted = false;
            this.player1.reap(this.skŏllĕnbŭzzz);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.hireOn);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            this.player1.clickCard(this.charette);
            expect(this.charette.location).toBe('under');
            expect(this.skŏllĕnbŭzzz.childCards).toContain(this.charette);
            expect(this.skŏllĕnbŭzzz.childCards.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should put creatures into play on destroyed', function () {
            this.player1.playCreature(this.skŏllĕnbŭzzz);
            this.player1.clickCard(this.blypyp);
            this.skŏllĕnbŭzzz.exhausted = false;
            this.player1.reap(this.skŏllĕnbŭzzz);
            this.player1.clickCard(this.charette);
            this.skŏllĕnbŭzzz.exhausted = false;
            this.player1.fightWith(this.skŏllĕnbŭzzz, this.troll);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.hireOn);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.skŏllĕnbŭzzz);
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.skŏllĕnbŭzzz.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.skŏllĕnbŭzzz);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should put creatures into play for opponent when opponent controls it', function () {
            this.player1.playCreature(this.skŏllĕnbŭzzz);
            this.player1.clickCard(this.blypyp);
            this.skŏllĕnbŭzzz.exhausted = false;
            this.player1.reap(this.skŏllĕnbŭzzz);
            this.player1.clickCard(this.charette);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.skŏllĕnbŭzzz);
            this.player2.clickPrompt('Right');
            this.player2.play(this.kaboom);
            expect(this.player2).toBeAbleToSelect(this.blypyp);
            expect(this.player2).toBeAbleToSelect(this.charette);
            expect(this.player2).not.toBeAbleToSelect(this.hireOn);
            expect(this.player2).not.toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            expect(this.player2).not.toBeAbleToSelect(this.shooler);
            expect(this.player2).not.toBeAbleToSelect(this.skŏllĕnbŭzzz);
            this.player2.clickCard(this.blypyp);
            this.player2.clickPrompt('Right');
            this.player2.clickPrompt('Right');
            expect(this.skŏllĕnbŭzzz.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.skŏllĕnbŭzzz);
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player2.player.creaturesInPlay.length).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
