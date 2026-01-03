describe('Inka the Spider', function () {
    describe("Inka the Spider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['inka-the-spider'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should stun a creature on play', function () {
            this.player1.playCreature(this.inkaTheSpider);
            expect(this.player1).toHavePrompt('Inka the Spider');
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should stun a creature on reap', function () {
            this.player1.playCreature(this.inkaTheSpider);
            this.player1.clickCard(this.krump);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.inkaTheSpider);
            expect(this.player1).toHavePrompt('Inka the Spider');
            this.player1.clickCard(this.troll);
            expect(this.krump.stunned).toBe(true);
            expect(this.troll.stunned).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should poison a creature on fight', function () {
            this.player1.playCreature(this.inkaTheSpider);
            this.player1.clickCard(this.krump);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.inkaTheSpider);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
