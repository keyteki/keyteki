describe('Qyxxlyxx Grave Master', function () {
    describe("Qyxxlyxx Grave Master's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['qyxxlyxx-grave-master', 'clone-home', 'psychic-network'],
                    inPlay: ['chelonia'],
                    discard: new Array(8).fill('hypnobeam').concat(['shadow-self']) // not yet haunted
                },
                player2: {
                    inPlay: ['flaxia', 'hunting-witch', 'witch-of-the-eye'],
                    discard: ['key-charge', 'dharna']
                }
            });
            this.player1.chains = 36;
        });

        it('purges a creature from opponent discard and deals 2 to each creature that shares a trait', function () {
            this.player1.playCreature(this.qyxxlyxxGraveMaster);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.hypnobeam);
            expect(this.player1).toBeAbleToSelect(this.dharna);
            expect(this.player1).not.toBeAbleToSelect(this.keyCharge);
            expect(this.player1).not.toBeAbleToSelect(this.chelonia);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.witchOfTheEye);
            this.player1.clickCard(this.dharna);
            expect(this.dharna.location).toBe('purged');
            expect(this.chelonia.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.witchOfTheEye.damage).toBe(2);
            expect(this.flaxia.damage).toBe(0);
            expect(this.qyxxlyxxGraveMaster.location).toBe('play area');
            expect(this.qyxxlyxxGraveMaster.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('purges a creature from player discard and deals 2 to each creature that shares a trait', function () {
            this.player1.playCreature(this.qyxxlyxxGraveMaster);
            this.player1.clickCard(this.shadowSelf);
            expect(this.shadowSelf.location).toBe('purged');
            expect(this.dharna.location).toBe('discard');
            expect(this.dharna.damage).toBe(0);
            expect(this.chelonia.location).toBe('play area');
            expect(this.chelonia.damage).toBe(0);
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.huntingWitch.damage).toBe(0);
            expect(this.witchOfTheEye.damage).toBe(0);
            expect(this.flaxia.damage).toBe(0);
            expect(this.qyxxlyxxGraveMaster.location).toBe('play area');
            expect(this.qyxxlyxxGraveMaster.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.playCreature(this.qyxxlyxxGraveMaster);
                this.player1.clickCard(this.shadowSelf);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('mars');
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.qyxxlyxxGraveMaster, this.flaxia);
                expect(this.qyxxlyxxGraveMaster.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.cloneHome);
                this.player1.play(this.psychicNetwork);
                this.player1.fightWith(this.qyxxlyxxGraveMaster, this.flaxia);
                expect(this.qyxxlyxxGraveMaster.location).toBe('archives');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
