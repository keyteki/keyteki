describe('blast-shielding', function () {
    describe("Blast Shielding's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: [
                        'chief-engineer-walls',
                        'armsmaster-molina',
                        'sci-officer-qincan',
                        'tactical-officer-moon',
                        'gamgee',
                        'bad-penny'
                    ],
                    hand: ['blast-shielding', 'universal-translator']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });

            this.player1.playUpgrade(this.blastShielding, this.armsmasterMolina);
            expect(this.armsmasterMolina.location).toBe('play area');
            expect(this.armsmasterMolina.upgrades).toContain(this.blastShielding);
        });

        it('should give +2 armor', function () {
            expect(this.armsmasterMolina.armor).toBe(2);
        });

        describe('when creature reap', function () {
            beforeEach(function () {
                this.player1.reap(this.armsmasterMolina);
            });

            it('should get prompt to move blast shield when creature is used, and not move if they want to not move it', function () {
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.armsmasterMolina.upgrades).toContain(this.blastShielding);
            });

            it('should get prompt to move blast shield when creature is used, and be able to move it right', function () {
                expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
                expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
                this.player1.clickCard(this.sciOfficerQincan);
                expect(this.armsmasterMolina.upgrades).not.toContain(this.blastShielding);
                expect(this.sciOfficerQincan.upgrades).toContain(this.blastShielding);
                expect(this.sciOfficerQincan.armor).toBe(2);
            });

            it('should get prompt to move blast shield when creature is used, and be able to move it left', function () {
                expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
                expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
                this.player1.clickCard(this.chiefEngineerWalls);
                expect(this.armsmasterMolina.upgrades).not.toContain(this.blastShielding);
                expect(this.chiefEngineerWalls.upgrades).toContain(this.blastShielding);
                expect(this.chiefEngineerWalls.armor).toBe(2);
            });
        });

        describe('when creature fight', function () {
            beforeEach(function () {
                this.player1.fightWith(this.armsmasterMolina, this.umbra);
            });

            it('should get prompt to move blast shield when creature is used, and not move if they want to not move it', function () {
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.armsmasterMolina.upgrades).toContain(this.blastShielding);
            });

            it('should get prompt to move blast shield when creature is used, and be able to move it right', function () {
                expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
                expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
                this.player1.clickCard(this.sciOfficerQincan);
                expect(this.armsmasterMolina.upgrades).not.toContain(this.blastShielding);
                expect(this.sciOfficerQincan.upgrades).toContain(this.blastShielding);
                expect(this.sciOfficerQincan.armor).toBe(2);
            });

            it('should get prompt to move blast shield when creature is used, and be able to move it left', function () {
                expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
                expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
                this.player1.clickCard(this.chiefEngineerWalls);
                expect(this.armsmasterMolina.upgrades).not.toContain(this.blastShielding);
                expect(this.chiefEngineerWalls.upgrades).toContain(this.blastShielding);
                expect(this.chiefEngineerWalls.armor).toBe(2);
            });
        });

        describe('when combined with Universal Translator', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.universalTranslator, this.armsmasterMolina);
            });

            describe('when creature reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.armsmasterMolina);
                });

                it('should get prompt to select first effect to resolve', function () {
                    expect(this.player1).toBeAbleToSelect(this.blastShielding);
                    expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
                });

                it('should allow using Blast Shielding first', function () {
                    this.player1.clickCard(this.blastShielding);
                    expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
                    expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
                    this.player1.clickCard(this.chiefEngineerWalls);
                    expect(this.armsmasterMolina.upgrades).not.toContain(this.blastShielding);
                    expect(this.chiefEngineerWalls.upgrades).toContain(this.blastShielding);
                    expect(this.chiefEngineerWalls.armor).toBe(2);
                });

                it('should allow using Universal Translator first', function () {
                    this.player1.clickCard(this.armsmasterMolina);
                    expect(this.player1).toBeAbleToSelect(this.gamgee);
                    expect(this.player1).toBeAbleToSelect(this.badPenny);
                    this.player1.clickCard(this.badPenny);
                });
            });
        });
    });
});
