describe('Hidden Moon Dojo', function() {
    integration(function() {
        describe('Hidden Moon Dojo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 7,
                        inPlay: ['fawning-diplomat'],
                        dynastyDiscard: [
                            'hidden-moon-dojo', 'mountaintop-statuary', 'favorable-ground',
                            'bayushi-liar', 'bayushi-manipulator', 'shosuro-miyako'
                        ]
                    },
                    player2: {
                        inPlay: []
                    }
                });
            });

            it('should flip an adjacent card face up during a conflict', function() {
                this.bayushiLiar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
                this.bayushiLiar.facedown = true;
                this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 3');
                this.bayushiManipulator = this.player1.placeCardInProvince('bayushi-manipulator', 'province 4');
                this.bayushiManipulator.facedown = true;
                this.player1.clickCard(this.hiddenMoonDojo);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['fawning-diplomat'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hiddenMoonDojo);
                expect(this.player1).toHavePrompt('Hidden Moon Dojo');
                expect(this.player1).toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).not.toBeAbleToSelect(this.favorableGround);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiManipulator);
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.facedown).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should trigger any abilities on being flipped', function() {
                this.mountaintopStatuary = this.player1.placeCardInProvince('mountaintop-statuary');
                this.mountaintopStatuary.facedown = true;
                this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['fawning-diplomat'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hiddenMoonDojo);
                expect(this.player1).toHavePrompt('Hidden Moon Dojo');
                this.player1.clickCard(this.mountaintopStatuary);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mountaintopStatuary);
            });

            it('should let its controller play adjacent cards as if from hand', function() {
                this.bayushiLiar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
                this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.bayushiManipulator = this.player1.placeCardInProvince('bayushi-manipulator', 'province 4');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.player1).toHavePrompt('Choose additional fate');
                this.player1.clickPrompt('1');
                expect(this.bayushiLiar.location).toBe('play area');
                expect(this.bayushiLiar.fate).toBe(1);
                expect(this.player1.fate).toBe(5);
            });

            it('should interact with Shosuro Miyako', function() {
                this.shosuroMiyako = this.player1.placeCardInProvince('shosuro-miyako');
                this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.player1.clickCard(this.shosuroMiyako);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shosuroMiyako);
            });

            it('should let its controller play adjacent cards into the conflict', function() {
                this.bayushiLiar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
                this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.bayushiManipulator = this.player1.placeCardInProvince('bayushi-manipulator', 'province 4');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['fawning-diplomat'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.bayushiManipulator);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.player1).toHavePrompt('Choose additional fate');
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Where do you wish to play this character?');
                this.player1.clickPrompt('Conflict');
                expect(this.bayushiLiar.location).toBe('play area');
                expect(this.bayushiLiar.inConflict).toBe(true);
                expect(this.bayushiLiar.fate).toBe(1);
                expect(this.player1.fate).toBe(5);
            });
        });
    });
});
