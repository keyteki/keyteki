describe('Com. Officer Hings', function () {
    describe("Com. Officer Hings' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina', 'tantadlin'],
                    hand: ['com-officer-hings', 'sensor-chief-garcia'],
                    discard: ['com-officer-gross', 'com-officer-gross']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens', 'troll', 'lamindra'],
                    hand: ['wipe-clear']
                }
            });

            this.comOfficerGross1 = this.player1.discard[0];
            this.comOfficerGross2 = this.player1.discard[1];
        });

        describe('when there is no Gross on deck', function () {
            beforeEach(function () {
                this.player1.play(this.comOfficerHings);
            });

            it('should click done and continue', function () {
                expect(this.player1).not.toBeAbleToSelect(this.comOfficerGross1);
                expect(this.player1).not.toBeAbleToSelect(this.comOfficerGross2);
                this.player1.clickPrompt('Done');
            });
        });

        describe('when there are two Gross on deck', function () {
            beforeEach(function () {
                this.player1.moveCard(this.comOfficerGross1, 'deck');
                this.player1.moveCard(this.comOfficerGross2, 'deck');
                this.player1.play(this.comOfficerHings);
            });

            it('should be optional', function () {
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should be able select one', function () {
                expect(this.player1).toBeAbleToSelect(this.comOfficerGross1);
                expect(this.player1).toBeAbleToSelect(this.comOfficerGross2);
            });

            describe('when one of them is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.comOfficerGross1);
                    this.player1.clickPrompt('Done');
                });

                it('should return to hand', function () {
                    expect(this.comOfficerGross1.location).toBe('hand');
                    expect(this.comOfficerGross2.location).toBe('deck');
                });

                describe('when used to reap with 1 Gross in play', function () {
                    beforeEach(function () {
                        this.player1.play(this.comOfficerGross1, true);
                        this.player1.clickPrompt('Done');
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                        this.player1.clickPrompt('staralliance');
                        expect(this.player1.player.hand.length).toBe(6);
                        this.player1.reap(this.comOfficerHings);
                        this.player1.clickCard(this.comOfficerGross1);
                    });

                    it('should draw 2 cards', function () {
                        expect(this.player1.player.hand.length).toBe(8);
                    });
                });

                describe('when used to reap with 2 Gross in play', function () {
                    beforeEach(function () {
                        this.player1.moveCard(this.comOfficerGross2, 'hand');
                        this.player1.play(this.comOfficerGross1);
                        this.player1.clickPrompt('Done');
                        this.player1.play(this.sensorChiefGarcia, true);
                        this.player1.play(this.comOfficerGross2, true);
                        this.player1.clickPrompt('Done');
                        expect(this.comOfficerGross1.location).toBe('play area');
                        expect(this.comOfficerGross2.location).toBe('play area');
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                        this.player1.clickPrompt('staralliance');
                        expect(this.player1.player.hand.length).toBe(6);
                        this.player1.reap(this.comOfficerHings);
                        expect(this.player1).toBeAbleToSelect(this.comOfficerGross1);
                        expect(this.player1).toBeAbleToSelect(this.comOfficerGross2);
                        this.player1.clickCard(this.comOfficerGross2);
                    });

                    it('should draw 3 cards', function () {
                        expect(this.player1.player.hand.length).toBe(9);
                    });
                });

                describe('when used to fight with 1 Gross in play', function () {
                    beforeEach(function () {
                        this.player1.play(this.comOfficerGross1, true);
                        this.player1.clickPrompt('Done');
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                        this.player1.clickPrompt('staralliance');
                        expect(this.player1.player.hand.length).toBe(6);
                        this.player1.fightWith(this.comOfficerHings, this.lamindra);
                        this.player1.clickCard(this.comOfficerGross1);
                    });

                    it('should draw 2 cards', function () {
                        expect(this.player1.player.hand.length).toBe(8);
                    });
                });
            });
        });
    });
});
