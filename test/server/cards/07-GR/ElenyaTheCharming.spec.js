describe('Elenya the Charming', function () {
    describe("Elenya the Charming's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['elenya-the-charming'],
                    inPlay: ['the-old-tinker', 'transitory-philosopher']
                },
                player2: {
                    amber: 6,
                    inPlay: ['groke', 'foozle', 'dust-pixie']
                }
            });
        });

        it('enters play under opponents control', function () {
            this.player1.playCreature(this.elenyaTheCharming);
            expect(this.player1.player.cardsInPlay).not.toContain(this.elenyaTheCharming);
            expect(this.player2.player.cardsInPlay).toContain(this.elenyaTheCharming);
        });

        it('gives control of most powerful creature after forging', function () {
            this.player1.playCreature(this.elenyaTheCharming);
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2).toBeAbleToSelect(this.groke);
            expect(this.player2).toBeAbleToSelect(this.foozle);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player2).not.toBeAbleToSelect(this.elenyaTheCharming);
            expect(this.player2).not.toBeAbleToSelect(this.theOldTinker);
            expect(this.player2).not.toBeAbleToSelect(this.transitoryPhilosopher);
            this.player2.clickCard(this.foozle);
            this.player2.clickPrompt('Right');
            expect(this.player1.player.cardsInPlay).toContain(this.foozle);
            expect(this.player2.player.cardsInPlay).not.toContain(this.foozle);
            expect(this.player1.player.cardsInPlay).not.toContain(this.groke);
            expect(this.player2.player.cardsInPlay).toContain(this.groke);
            this.player2.clickPrompt('ekwidon');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
