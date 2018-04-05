describe('Shiba Tetsu', function() {
    integration(function() {
        describe('When playing a spell card', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay:['Shiba Tetsu', 'Keeper Initiate', 'Adept of the Waves'],
                        hand: ['Supernatural Storm', 'Supernatural Storm', 'Supernatural Storm']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['Keeper Initiate', 'Adept of the Waves'],
                    defenders: []
                });

                this.player2.pass(); //Pass priority to player 1
                this.storm1 = this.player1.hand[0];
                this.storm2 = this.player1.hand[1];
                this.shiba = this.player1.findCardByName('Shiba Tetsu', 'play area');
                this.keeper = this.player1.findCardByName('Keeper Initiate', 'play area');

                //Play a spell
                this.player1.clickCard(this.storm1);
                this.player1.clickCard(this.keeper);
            });

            it('should prompt the player for reactions', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
            });

            it('should have Shiba Tetsu as a target', function() {
                expect(this.player1).toBeAbleToSelect(this.shiba);
            });

            describe('when the player activates the reaction', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shiba);
                });

                it('should increase its military skill', function() {
                    expect(this.shiba.getMilitarySkill()).toBe(3);
                });

                it('should increase its political skill', function() {
                    expect(this.shiba.getPoliticalSkill()).toBe(2);
                });
            });

            describe('when playing additional spells', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shiba);
                    this.player2.pass();
                    this.player1.clickCard(this.storm2);
                    this.player1.clickCard(this.keeper);
                });

                it('should prompt the player again', function() {
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.shiba);
                });

                it('should resolve again', function() {
                    this.player1.clickCard(this.shiba);
                    expect(this.shiba.getMilitarySkill()).toBe(4);
                    expect(this.shiba.getPoliticalSkill()).toBe(3);
                });
            });
        });
    });
});
