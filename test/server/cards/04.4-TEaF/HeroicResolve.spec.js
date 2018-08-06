describe('Heroic Resolve', function () {
    integration(function () {
        describe('Heroic Resolve\'s ability. ', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['akodo-toturi'],
                        hand: ['heroic-resolve'],
                        conflictDeck: []
                    }
                });
                this.akodoToturi = this.player1.inPlay[0];
                this.heroicResolve = this.player1.playAttachment('heroic-resolve', 'akodo-toturi');
                this.player2.pass();
            });

            describe('You should be able to attach Heroic Resolve', function () {
                beforeEach(function () {
                    this.akodoToturi.bow();
                });

                it('and it should increase attached characters military and political skills by 1.', function () {
                    expect(this.akodoToturi.getMilitarySkill()).toBe(this.akodoToturi.getBaseMilitarySkill() + 1);
                    expect(this.akodoToturi.getPoliticalSkill()).toBe(this.akodoToturi.getBasePoliticalSkill() + 1);
                });

                describe('When less than two rings are claimed by controlling player', function () {
                    beforeEach(function () {
                        this.player1.claimRing('air');
                    });

                    it('triggering the card ability should not ready the attached character.', function () {
                        this.player1.clickCard(this.heroicResolve);
                        expect(this.akodoToturi.bowed).toBe(true);
                    });
                });

                describe('When two or more rings are claimed by controlling player', function () {
                    beforeEach(function () {
                        this.player1.claimRing('air');
                        this.player1.claimRing('earth');
                    });

                    it('triggering the card ability should ready the attached character.', function () {
                        this.player1.clickCard(this.heroicResolve);
                        expect(this.akodoToturi.bowed).toBe(false);
                    });
                });
            });
        });
    });
});
