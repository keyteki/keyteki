describe('Narl Gibbus', function () {
    describe("Narl Gibbus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['narl-gibbus'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['umbra', 'troll', 'flaxia']
                }
            });
        });

        it('self-enrages on play', function () {
            this.player1.playCreature(this.narlGibbus);
            expect(this.narlGibbus.tokens.enrage).toBe(1);
        });

        it('gets keywords while enraged', function () {
            this.player1.playCreature(this.narlGibbus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.narlGibbus, this.flaxia);
            expect(this.narlGibbus.damage).toBe(0);
            expect(this.flaxia.damage).toBe(3);
            expect(this.troll.damage).toBe(3);
            expect(this.narlGibbus.tokens.enrage).toBe(undefined);
        });

        it('loses keywords while not enraged', function () {
            this.player1.playCreature(this.narlGibbus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.narlGibbus, this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.narlGibbus, this.flaxia);
            expect(this.narlGibbus.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.damage).toBe(3);
        });

        it('self-enrages after reap', function () {
            this.player1.playCreature(this.narlGibbus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.narlGibbus, this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.narlGibbus);
            expect(this.narlGibbus.tokens.enrage).toBe(1);
        });

        it('does not give keywords to other creatures', function () {
            this.player1.playCreature(this.narlGibbus);
            this.player1.fightWith(this.dustPixie, this.flaxia);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.damage).toBe(1);
            expect(this.troll.damage).toBe(0);
        });
    });
});
