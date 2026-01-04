describe('Beehemoth', function () {
    describe("Beehemoth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['beehemoth', 'dust-pixie', 'hunting-witch', 'flaxia']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should add one power counter a creature at start of turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1).toBeAbleToSelect(this.beehemoth);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.getPower()).toBe(5);
            expect(this.flaxia.tokens.power).toBe(1);
            this.player1.clickPrompt('brobnar');
        });

        it('should move anywhere in battleline on reap', function () {
            this.player1.reap(this.beehemoth);
            expect(this.player1).toBeAbleToSelect(this.beehemoth);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.beehemoth);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should move remove neighbor power counters and gain amber on reap', function () {
            this.flaxia.tokens.power = 3;
            this.huntingWitch.tokens.power = 2;
            this.player1.reap(this.beehemoth);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Left');
            expect(this.player1.amber).toBe(7);
            expect(this.flaxia.tokens.power).toBe(undefined);
            expect(this.huntingWitch.tokens.power).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should move remove one neighbor power counters and gain amber on reap', function () {
            this.flaxia.tokens.power = 3;
            this.player1.reap(this.beehemoth);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Left');
            expect(this.player1.amber).toBe(5);
            expect(this.flaxia.tokens.power).toBe(undefined);
            expect(this.huntingWitch.tokens.power).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing with no neighbors', function () {
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.moveCard(this.huntingWitch, 'discard');
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.reap(this.beehemoth);
            this.player1.clickCard(this.beehemoth);
            this.player1.clickPrompt('Left');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
