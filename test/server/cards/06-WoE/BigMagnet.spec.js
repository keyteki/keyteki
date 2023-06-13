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
                this.player1.clickCard(this.troll);

                expect(this.troll.upgrades).toEqual([]);
                expect(this.zorg.upgrades).toEqual([]);
            });
        });
    });

    describe('with Quadracorder played onto enemy creature,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['troll'],
                    hand: ['big-magnet', 'quadracorder']
                },
                player2: {
                    inPlay: ['batdrone'],
                    hand: ['reckless-experimentation']
                }
            });

            this.player1.playUpgrade(this.quadracorder, this.batdrone);
        });

        describe('before big magnet played,', function () {
            it('opponent keys should cost 1 more', function () {
                this.player2.amber = 6;
                this.player1.endTurn();

                expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
                expect(this.player2).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });

            it('friendly keys should be forgeable', function () {
                this.player1.amber = 6;
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).toHavePrompt('Which key would you like to forge?');
            });
        });

        describe('after big magnet played,', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('mars');

                this.player1.play(this.bigMagnet);
                this.player1.clickCard(this.troll);
            });

            it('opponent keys should cost 1 more', function () {
                this.player2.amber = 6;
                this.player1.endTurn();

                expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
                expect(this.player2).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });

            it('friendly key should be forgeable', function () {
                this.player1.endTurn();
                this.player1.amber = 6;
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).toHavePrompt('Which key would you like to forge?');
            });
        });
    });

    describe('with Quadracorder played onto friendly creature by enemy,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: ['big-magnet']
                },
                player2: {
                    inPlay: ['batdrone'],
                    hand: ['reckless-experimentation', 'quadracorder']
                }
            });

            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.quadracorder, this.troll);
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
        });

        describe('before big magnet played,', function () {
            it('opponent keys should be forgeable', function () {
                this.player2.amber = 6;
                this.player1.endTurn();

                expect(this.player2).toHavePrompt('Which key would you like to forge?');
            });

            it('friendly keys should cost 1 more', function () {
                this.player1.amber = 6;
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
                expect(this.player1).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });
        });

        describe('after big magnet played,', function () {
            beforeEach(function () {
                this.player1.play(this.bigMagnet);
                this.player1.clickCard(this.troll);
            });

            it('opponent keys should cost 1 more', function () {
                this.player2.amber = 6;
                this.player1.endTurn();

                expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
                expect(this.player2).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });

            it('friendly keys should be forgeable', function () {
                this.player1.amber = 6;
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).toHavePrompt('Which key would you like to forge?');
            });
        });
    });

    describe('with Disruption Field played onto friendly creature by enemy,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'mindworm'],
                    hand: ['big-magnet']
                },
                player2: {
                    inPlay: ['batdrone'],
                    hand: ['reckless-experimentation', 'disruption-field']
                }
            });

            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.disruptionField, this.mindworm);
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.reap(this.mindworm);
        });

        describe('before big magnet played,', function () {
            it('opponent keys should be forgeable', function () {
                this.player2.amber = 6;
                this.player1.endTurn();

                expect(this.player2).toHavePrompt('Which key would you like to forge?');
            });

            it('friendly keys should cost 1 more', function () {
                this.player1.amber = 6;
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
                expect(this.player1).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });
        });

        describe('after big magnet played,', function () {
            beforeEach(function () {
                this.player1.play(this.bigMagnet);
                this.player1.clickCard(this.troll);
            });

            it('opponent keys should cost 1 more', function () {
                this.player2.amber = 6;
                this.player1.endTurn();

                expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
                expect(this.player2).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });

            it('friendly keys should be forgeable', function () {
                this.player1.amber = 6;
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).toHavePrompt('Which key would you like to forge?');
            });

            it('Disruption field counters should be moved', function () {
                expect(this.disruptionField.tokens.disruption).toBe(1);
            });
        });
    });

    describe('with upgrades that move,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['commander-dhrxgar'],
                    hand: ['big-magnet', 'blood-of-titans']
                },
                player2: {
                    inPlay: ['batdrone'],
                    hand: ['reckless-experimentation']
                }
            });

            this.player1.playUpgrade(this.bloodOfTitans, this.commanderDhrxgar);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playUpgrade(this.recklessExperimentation, this.batdrone);
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.bigMagnet);
            this.player1.clickCard(this.commanderDhrxgar);
        });

        it('attachment effects should not trigger', function () {
            expect(this.player1.amber).toBe(4);
        });
    });
});
