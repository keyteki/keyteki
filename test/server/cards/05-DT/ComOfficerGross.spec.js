describe('Com. Officer Gross', function () {
    describe("Com. Officer Gross' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina', 'tantadlin'],
                    hand: ['com-officer-gross', 'sensor-chief-garcia'],
                    discard: ['com-officer-hings', 'com-officer-hings']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens', 'troll', 'lamindra'],
                    hand: ['wipe-clear']
                }
            });

            this.comOfficerHings1 = this.player1.discard[0];
            this.comOfficerHings2 = this.player1.discard[1];
        });

        describe('when there is no Hings on deck', function () {
            beforeEach(function () {
                this.player1.play(this.comOfficerGross);
            });

            it('should click done and continue', function () {
                expect(this.player1).not.toBeAbleToSelect(this.comOfficerHings1);
                expect(this.player1).not.toBeAbleToSelect(this.comOfficerHings2);
                this.player1.clickPrompt('Done');
            });
        });

        describe('when there are two Hings on deck', function () {
            beforeEach(function () {
                this.player1.moveCard(this.comOfficerHings1, 'deck');
                this.player1.moveCard(this.comOfficerHings2, 'deck');
                this.player1.play(this.comOfficerGross);
            });

            it('should be optional', function () {
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should be able select one', function () {
                expect(this.player1).toBeAbleToSelect(this.comOfficerHings1);
                expect(this.player1).toBeAbleToSelect(this.comOfficerHings2);
            });

            describe('when one of them is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.comOfficerHings1);
                    this.player1.clickPrompt('Done');
                });

                it('should return to hand', function () {
                    expect(this.comOfficerHings1.location).toBe('hand');
                    expect(this.comOfficerHings2.location).toBe('deck');
                });

                describe('when used to reap with 1 Hings in play', function () {
                    beforeEach(function () {
                        this.player1.play(this.comOfficerHings1, true);
                        this.player1.clickPrompt('Done');
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                        this.player1.clickPrompt('staralliance');
                        this.player1.reap(this.comOfficerGross);
                        this.player1.clickCard(this.comOfficerHings1);
                    });

                    it('should add +1 power counter to creatures among them', function () {
                        expect(this.comOfficerGross.powerCounters).toBe(0);
                        expect(this.armsmasterMolina.powerCounters).toBe(1);
                        expect(this.tantadlin.powerCounters).toBe(1);
                        expect(this.comOfficerHings1.powerCounters).toBe(0);
                    });
                });

                describe('when used to reap with 2 Gross in play', function () {
                    beforeEach(function () {
                        this.player1.moveCard(this.comOfficerHings2, 'hand');
                        this.player1.play(this.comOfficerHings1, true);
                        this.player1.clickPrompt('Done');
                        this.player1.play(this.sensorChiefGarcia, true);
                        this.player1.play(this.comOfficerHings2, true);
                        this.player1.clickPrompt('Done');
                        expect(this.comOfficerHings1.location).toBe('play area');
                        expect(this.comOfficerHings2.location).toBe('play area');
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                        this.player1.clickPrompt('staralliance');
                        this.player1.reap(this.comOfficerGross);
                        expect(this.player1).toBeAbleToSelect(this.comOfficerHings1);
                        expect(this.player1).toBeAbleToSelect(this.comOfficerHings2);
                        this.player1.clickCard(this.comOfficerHings2);
                    });

                    it('should add +1 power counter to creatures among them', function () {
                        expect(this.comOfficerGross.powerCounters).toBe(0);
                        expect(this.armsmasterMolina.powerCounters).toBe(1);
                        expect(this.tantadlin.powerCounters).toBe(1);
                        expect(this.comOfficerHings1.powerCounters).toBe(1);
                        expect(this.comOfficerHings2.powerCounters).toBe(0);
                    });
                });

                describe('when used to fight with 1 Gross in play', function () {
                    beforeEach(function () {
                        this.player1.play(this.comOfficerHings1, true);
                        this.player1.clickPrompt('Done');
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                        this.player1.clickPrompt('staralliance');
                        this.player1.fightWith(this.comOfficerGross, this.lamindra);
                        this.player1.clickCard(this.comOfficerHings1);
                    });

                    it('should add +1 power counter to creatures among them', function () {
                        expect(this.comOfficerGross.powerCounters).toBe(0);
                        expect(this.armsmasterMolina.powerCounters).toBe(1);
                        expect(this.tantadlin.powerCounters).toBe(1);
                        expect(this.comOfficerHings1.powerCounters).toBe(0);
                    });
                });
            });
        });
    });
});
