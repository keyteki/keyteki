describe('Pragmatism', function() {
    integration(function() {
        describe('Pragmatism\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 6,
                        inPlay: ['borderlands-defender', 'keeper-initiate'],
                        hand: ['pragmatism', 'assassination']
                    },
                    player2: {
                        honor: 5,
                        inPlay: ['bayushi-liar', 'bayushi-yunako']
                    }
                });

                this.keeperInitiate = this.player1.findCardByName('keeper-initiate');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
                this.bayushiYunako = this.player2.findCardByName('bayushi-yunako');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');

                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    province: this.shamefulDisplay,
                    attackers: [this.borderlandsDefender, this.keeperInitiate],
                    defenders: [this.bayushiLiar, this.bayushiYunako]
                });
            });

            it('shouldn\'t be playable on opponent\'s characters', function() {
                this.player2.pass();
                this.player1.clickCard('pragmatism');
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiLiar);
            });

            describe('when controller is more honorable than the opponent', function() {

                beforeEach(function() {
                    this.player2.pass();
                    this.player1.clickCard('pragmatism');
                    this.player1.clickCard(this.borderlandsDefender);
                });

                it('should increase attached characters military and political skills by 1', function () {
                    expect(this.borderlandsDefender.getMilitarySkill()).toBe(this.borderlandsDefender.getBaseMilitarySkill() + 1);
                    expect(this.borderlandsDefender.getPoliticalSkill()).toBe(this.borderlandsDefender.getBasePoliticalSkill() + 1);
                });

                it('attached character can be honored', function () {
                    this.player2.clickCard(this.shamefulDisplay);
                    expect(this.player2).toHavePrompt('Shameful Display');
                    expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player2).toBeAbleToSelect(this.bayushiLiar);
                    this.player2.clickCard(this.borderlandsDefender);
                    this.player2.clickCard(this.bayushiLiar);
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('Honor');
                    expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                    this.player2.clickCard(this.borderlandsDefender);
                    expect(this.borderlandsDefender.isHonored).toBe(true);
                    expect(this.bayushiLiar.isDishonored).toBe(true);
                });

                it('attached character can be dishonored', function () {
                    this.player2.clickCard(this.shamefulDisplay);
                    expect(this.player2).toHavePrompt('Shameful Display');
                    expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player2).toBeAbleToSelect(this.bayushiLiar);
                    this.player2.clickCard(this.borderlandsDefender);
                    this.player2.clickCard(this.bayushiLiar);
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('Dishonor');
                    expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                    this.player2.clickCard(this.borderlandsDefender);
                    expect(this.borderlandsDefender.isDishonored).toBe(true);
                    expect(this.bayushiLiar.isHonored).toBe(true);
                });
            });

            describe('when controller is less honorable than the opponent', function() {
                beforeEach(function() {
                    this.player2.pass();
                    this.player1.clickCard('pragmatism');
                    this.player1.clickCard(this.borderlandsDefender);
                    this.player2.pass();
                    this.player1.clickCard('assassination');
                    this.player1.clickCard(this.bayushiLiar);
                });

                it('should increase attached characters military and political skills by 2', function () {
                    expect(this.borderlandsDefender.getMilitarySkill()).toBe(this.borderlandsDefender.getBaseMilitarySkill() + 2);
                    expect(this.borderlandsDefender.getPoliticalSkill()).toBe(this.borderlandsDefender.getBasePoliticalSkill() + 2);
                });

                it('attached character can be honored', function () {
                    this.player2.clickCard(this.shamefulDisplay);
                    expect(this.player2).toHavePrompt('Shameful Display');
                    expect(this.player2).toHavePrompt('Select two characters');
                    expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                    expect(this.player2).toBeAbleToSelect(this.bayushiYunako);
                    this.player2.clickCard(this.keeperInitiate);
                    this.player2.clickCard(this.bayushiYunako);
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('Honor');
                    expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                });

                it('attached character can be dishonored', function () {
                    this.player2.clickCard(this.shamefulDisplay);
                    expect(this.player2).toHavePrompt('Shameful Display');
                    expect(this.player2).toHavePrompt('Select two characters');
                    expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                    expect(this.player2).toBeAbleToSelect(this.bayushiYunako);
                    this.player2.clickCard(this.keeperInitiate);
                    this.player2.clickCard(this.bayushiYunako);
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('Dishonor');
                    expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                });
            });
        });
    });
});
