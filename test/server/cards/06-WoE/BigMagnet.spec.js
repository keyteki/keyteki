describe('Big Magnet', function () {
    describe("'s play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['troll', 'zorg'],
                    hand: ['big-magnet', 'mothergun', 'jammer-pack', 'biomatrix-backup']
                },
                player2: {
                    inPlay: ['batdrone'],
                    hand: ['reckless-experimentation']
                }
            });
        });

        describe('with upgrades in play,', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.jammerPack, this.zorg);
                this.player1.playUpgrade(this.biomatrixBackup, this.troll);
                this.player1.endTurn();

                this.player2.clickPrompt('logos');
                this.player2.playUpgrade(this.recklessExperimentation, this.batdrone);
                this.player2.endTurn();

                this.player1.clickPrompt('mars');

                this.player1.play(this.bigMagnet);
            });

            it('should offer only friendly creatures', function () {
                expect(this.player1).toHavePrompt('Big Magnet');
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            });

            describe('on choosing a creature,', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.troll);
                });

                it('should move all upgrades to the chosen creature', function () {
                    expect(this.troll.upgrades).toContain(this.biomatrixBackup);
                    expect(this.troll.upgrades).toContain(this.jammerPack);
                    expect(this.troll.upgrades).toContain(this.recklessExperimentation);
                });

                it('should have removed upgrades from the other creatures', function () {
                    expect(this.zorg.upgrades).not.toContain(this.jammerPack);
                    expect(this.batdrone.upgrades).not.toContain(this.recklessExperimentation);
                });
            });
        });

        describe('without upgrades in play,', function () {
            beforeEach(function () {
                this.player1.clickCard(this.bigMagnet);
            });

            it('should still prompt', function () {
                expect(this.player1).toHavePrompt('Big Magnet');
            });

            it('should not do anything', function () {
                expect(this.troll.upgrades).toEqual([]);
                expect(this.zorg.upgrades).toEqual([]);
            });
        });
    });
});
