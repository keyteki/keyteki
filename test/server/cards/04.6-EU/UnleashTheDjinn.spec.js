describe('Unleash the Djinn', function() {
    integration(function() {
        describe('Unleash the Djinn\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 7,
                        inPlay: ['border-rider', 'moto-horde'],
                        hand: ['unleash-the-djinn', 'iuchi-wayfinder']
                    },
                    player2: {
                        inPlay: ['hida-amoro', 'crisis-breaker'],
                        hand: ['hiruma-ambusher']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.motoHorde = this.player1.findCardByName('moto-horde');

                this.hidaAmoro = this.player2.findCardByName('hida-amoro');
                this.crisisBreaker = this.player2.findCardByName('crisis-breaker');
                this.crisisBreaker.bowed = true;

                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 2');

                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderRider, this.motoHorde],
                    defenders: [this.hidaAmoro],
                    province: this.shamefulDisplay1
                });
                this.player2.pass();
                this.player1.clickCard('unleash-the-djinn');
            });

            it('should cost 3 honor to play the event', function() {
                expect(this.player1.honor).toBe(4);
            });

            it('should set all participating characters military and political skill to 3', function() {
                expect(this.borderRider.getMilitarySkill()).toBe(3);
                expect(this.borderRider.getPoliticalSkill()).toBe(3);

                // cannot modify dash skills
                expect(this.motoHorde.getPoliticalSkill()).toBe(0);
                expect(this.motoHorde.getMilitarySkill()).toBe(3);

                // cannot modify dash skills
                expect(this.hidaAmoro.getPoliticalSkill()).toBe(0);
                expect(this.hidaAmoro.getMilitarySkill()).toBe(3);
            });

            it('should not effect characters that are moved to the conflict', function() {
                this.player2.clickCard(this.crisisBreaker);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.crisisBreaker.getMilitarySkill()).toBe(this.crisisBreaker.getBaseMilitarySkill());
                expect(this.crisisBreaker.getPoliticalSkill()).toBe(this.crisisBreaker.getBasePoliticalSkill());
            });

            it('should not effect characters played from hand', function() {
                this.hirumaAmbusher = this.player2.playCharacterFromHand('hiruma-ambusher');
                this.player2.clickPrompt('Conflict');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.hirumaAmbusher);
                expect(this.player2).toHavePrompt('Hiruma Ambusher');
                this.player2.clickCard(this.borderRider);
                expect(this.hirumaAmbusher.getMilitarySkill()).toBe(this.hirumaAmbusher.getBaseMilitarySkill());
                expect(this.hirumaAmbusher.getPoliticalSkill()).toBe(this.hirumaAmbusher.getBasePoliticalSkill());

                this.iuchiWayfinder = this.player1.playCharacterFromHand('iuchi-wayfinder');
                this.player1.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.iuchiWayfinder);
                expect(this.player1).toHavePrompt('Iuchi Wayfinder');
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay2);
                expect(this.iuchiWayfinder.getMilitarySkill()).toBe(this.iuchiWayfinder.getBaseMilitarySkill());
                expect(this.iuchiWayfinder.getPoliticalSkill()).toBe(this.iuchiWayfinder.getBasePoliticalSkill());
            });
        });
    });
});
