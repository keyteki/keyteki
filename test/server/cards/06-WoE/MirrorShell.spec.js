describe('Mirror Shell', function () {
    describe("Mirror Shell's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    token: 'grunt',
                    inPlay: ['questor-jarta', 'first-officer-frane', 'grunt:clone-home'],
                    hand: ['mirror-shell', 'legionary-trainer']
                },
                player2: {
                    amber: 4,
                    token: 'grumpus',
                    inPlay: ['grumpus:batdrone', 'bumpsy']
                }
            });
        });

        it('makes a token on play', function () {
            this.player1.playUpgrade(this.mirrorShell, this.questorJarta);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
        });

        it('turns tokens into copy of a creature', function () {
            this.player1.playUpgrade(this.mirrorShell, this.firstOfficerFrane);
            this.player1.clickPrompt('Right');
            this.player1.reap(this.firstOfficerFrane);
            this.player1.clickPrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);
            expect(this.questorJarta.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.player1.reap(this.grunt);
            this.player1.clickCard(this.questorJarta);
            expect(this.questorJarta.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it('works in a non staralliance house', function () {
            this.player1.playUpgrade(this.mirrorShell, this.questorJarta);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            this.player1.reap(this.questorJarta);
            this.player1.clickPrompt('Questor Jarta');
            this.player1.clickCard(this.questorJarta);
            this.player1.reap(this.grunt);
            this.player1.clickCard(this.grunt);
            expect(this.player1.amber).toBe(5);

            this.player1.playCreature(this.legionaryTrainer);
            this.player1.clickPrompt('Right');
            let grunt2 = this.player1.player.creaturesInPlay[5];
            this.player1.reap(grunt2);
            this.player1.clickCard(grunt2);
            expect(this.player1.amber).toBe(7);
        });
    });
});
