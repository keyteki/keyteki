describe('Scout', function () {
    describe("Scout's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['scout'],
                    inPlay: ['krump', 'bumpsy']
                },
                player2: {
                    inPlay: ['sequis', 'bulwark']
                }
            });
        });

        it('should give skirmish to selected creatures and fight with them', function () {
            this.player1.play(this.scout);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.bulwark);
            expect(this.krump.damage).toBe(0);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.sequis.damage).toBe(2);
            expect(this.bulwark.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting fewer than 2 creatures', function () {
            this.player1.play(this.scout);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.sequis);

            expect(this.bumpsy.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
            expect(this.sequis.damage).toBe(2);
            expect(this.bulwark.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not ready creatures', function () {
            this.krump.exhausted = true;
            this.player1.play(this.scout);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.sequis);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
            expect(this.sequis.damage).toBe(1);
            expect(this.bulwark.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
