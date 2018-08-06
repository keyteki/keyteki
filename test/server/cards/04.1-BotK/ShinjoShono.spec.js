describe('Shinjo Shono', function() {
    integration(function() {
        describe('Shinjo Shono\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-shono', 'miya-mystic', 'seppun-guardsman'],
                        hand: ['seal-of-the-unicorn']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });

                this.shinjoShono = this.player1.findCardByName('shinjo-shono');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');
                this.sealOfTheUnicorn = this.player1.findCardByName('seal-of-the-unicorn');
                this.borderRider = this.player2.findCardByName('border-rider');
                this.noMoreActions();
            });

            it('should not activate when there are not more participating characters than opponent', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shinjoShono],
                    defenders: [this.borderRider]
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoShono);
                expect(this.shinjoShono.getMilitarySkill()).toBe(4);
                expect(this.shinjoShono.getPoliticalSkill()).toBe(3);
            });

            it('should only pump friendly cavalry', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shinjoShono, this.miyaMystic, this.seppunGuardsman],
                    defenders: [this.borderRider]
                });
                this.player2.pass();
                this.player1.clickCard(this.sealOfTheUnicorn);
                this.player1.clickCard(this.miyaMystic);
                this.player2.pass();
                this.player1.clickCard(this.shinjoShono);
                //Shinjo should pump himself, and the mystic (since Seal gives the mystic Cavalry)
                expect(this.shinjoShono.getMilitarySkill()).toBe(5);
                expect(this.shinjoShono.getPoliticalSkill()).toBe(4);
                expect(this.miyaMystic.getMilitarySkill()).toBe(3);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(2);
                //Shinjo should not pump the guardsman as it is not a cavalry,
                //nor the border rider as she is not friendly
                expect(this.seppunGuardsman.getMilitarySkill()).toBe(2);
                expect(this.borderRider.getMilitarySkill()).toBe(2);
                expect(this.borderRider.getPoliticalSkill()).toBe(1);

            });
        });
    });
});
