describe('Chuff Ape', function () {
    describe("Chuff Ape's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['chuff-ape'],
                    inPlay: ['lamindra', 'urchin']
                },
                player2: {
                    inPlay: ['ancient-bear', 'duskwitch', 'niffle-ape']
                }
            });

            this.player1.play(this.chuffApe);
        });

        it('should enter play stunned', function () {
            expect(this.chuffApe.location).toBe('play area');
            expect(this.chuffApe.stunned).toBe(true);
            this.player1.endTurn();
        });

        describe('after unstun', function () {
            beforeEach(function () {
                this.chuffApe.unstun();
                this.chuffApe.ready();
            });

            it('after fight, should be able to choose not to sacrifice', function () {
                this.player1.fightWith(this.chuffApe, this.ancientBear);
                expect(this.chuffApe.damage).toBe(5);
                this.player1.clickPrompt('Done');
                this.player1.endTurn();
            });

            it('after fight, should be able to sacrifice to heal', function () {
                this.player1.fightWith(this.chuffApe, this.ancientBear);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.urchin);
                expect(this.player1).not.toBeAbleToSelect(this.duskwitch);
                expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
                this.player1.clickCard(this.lamindra);
                expect(this.lamindra.location).toBe('discard');
                expect(this.chuffApe.damage).toBe(0);
                this.player1.endTurn();
            });

            it('after reap, should be able to choose not to sacrifice', function () {
                this.chuffApe.damage = 3;
                this.player1.reap(this.chuffApe);
                expect(this.chuffApe.damage).toBe(3);
                this.player1.clickPrompt('Done');
                this.player1.endTurn();
            });

            it('after reap, should be able to sacrifice to heal', function () {
                this.chuffApe.damage = 3;
                this.player1.reap(this.chuffApe);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.urchin);
                expect(this.player1).not.toBeAbleToSelect(this.duskwitch);
                expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
                this.player1.clickCard(this.lamindra);
                expect(this.lamindra.location).toBe('discard');
                expect(this.chuffApe.damage).toBe(0);
                this.player1.endTurn();
            });
        });
    });
});
