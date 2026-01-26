describe('Bawretchadontius', function () {
    describe("Bawretchadontius's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    hand: ['bawretchadontius', 'bawretchadontius2'],
                    inPlay: ['faust-the-great', 'tricerian-legionary']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'dust-pixie', 'troll']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.bawretchadontius2, 'discard');
            this.player1.clickCard(this.bawretchadontius);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.bawretchadontius, 'discard');
            this.player1.clickCard(this.bawretchadontius2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.bawretchadontius);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.bawretchadontius2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should exalt a friendly and 2 enemy creatures on play', function () {
            this.player1.playCreature(this.bawretchadontius);
            expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.faustTheGreat);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).not.toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).not.toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            expect(this.faustTheGreat.amber).toBe(1);
            expect(this.bawretchadontius.amber).toBe(0);
            expect(this.lamindra.amber).toBe(1);
            expect(this.dustPixie.amber).toBe(1);
            expect(this.troll.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should exalt a friendly and 2 enemy creatures on reap', function () {
            this.player1.playCreature(this.bawretchadontius);
            this.player1.clickCard(this.faustTheGreat);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            this.bawretchadontius.ready();
            this.player1.reap(this.bawretchadontius);
            expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.faustTheGreat);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).not.toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).not.toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            expect(this.faustTheGreat.amber).toBe(2);
            expect(this.bawretchadontius.amber).toBe(0);
            expect(this.lamindra.amber).toBe(2);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.troll.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should exalt a friendly and 2 enemy creatures on fight', function () {
            this.player1.playCreature(this.bawretchadontius);
            this.player1.clickCard(this.faustTheGreat);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            this.bawretchadontius.ready();
            this.player1.fightWith(this.bawretchadontius, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.faustTheGreat);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).not.toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).not.toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            expect(this.faustTheGreat.amber).toBe(2);
            expect(this.bawretchadontius.amber).toBe(0);
            expect(this.lamindra.amber).toBe(2);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.troll.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give creatures with amber on them a reap ability to do 4 damage', function () {
            this.player1.playCreature(this.bawretchadontius);
            this.player1.clickCard(this.faustTheGreat);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            this.player1.reap(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).toBeAbleToSelect(this.bawretchadontius);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(4);
            this.player1.reap(this.tricerianLegionary);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
