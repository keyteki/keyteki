describe('Yzphyz Knowdrone', function () {
    describe("Yzphyz Knowdrone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['collector-worm'],
                    archives: ['ember-imp'],
                    hand: ['yzphyz-knowdrone', 'key-to-dis']
                },
                player2: {
                    inPlay: ['mighty-tiger'],
                    archives: ['troll']
                }
            });
        });

        it('should archive a card from hand, purge an archived card, and stun a creature', function () {
            this.player1.play(this.yzphyzKnowdrone);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.keyToDis);
            expect(this.keyToDis.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose which card to purge');
            expect(this.player1).toBeAbleToSelect(this.keyToDis);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a creature to stun');
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).toBeAbleToSelect(this.yzphyzKnowdrone);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow stunning a friendly creature', function () {
            this.player1.play(this.yzphyzKnowdrone);
            this.player1.clickCard(this.keyToDis);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.collectorWorm);
            expect(this.collectorWorm.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Yzphyz Knowdrone with abduction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper'],
                    hand: ['yzphyz-knowdrone', 'scowly-caper']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
            this.player1.makeMaverick(this.scowlyCaper, 'mars');
        });

        it("should return abducted creature to owner's hand instead of purging or stunning", function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.emberImp);
            expect(this.player1.archives).toContain(this.emberImp);
            this.player1.playCreature(this.yzphyzKnowdrone);
            this.player1.clickCard(this.scowlyCaper);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1).not.toHavePrompt('Choose a creature to stun');
            expect(this.emberImp.location).toBe('hand');
            expect(this.player1.archives).not.toContain(this.emberImp);
            expect(this.player2.hand).toContain(this.emberImp);
            expect(this.player2.purge).not.toContain(this.emberImp);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should purge previously abducted creature', function () {
            this.player1.playCreature(this.scowlyCaper);
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.scowlyCaper);
            expect(this.player1.archives).toContain(this.scowlyCaper);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            expect(this.player1).toHavePrompt('Access Archives');
            this.player1.clickPrompt('Yes');
            this.player1.playCreature(this.yzphyzKnowdrone);
            this.player1.clickCard(this.scowlyCaper);
            this.player1.clickCard(this.scowlyCaper);
            this.player1.clickCard(this.emberImp);
            expect(this.scowlyCaper.location).toBe('purged');
            expect(this.emberImp.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
