describe('Tactical Officer Moon', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['batdrone', 'troll', 'dextre', 'ganger-chieftain', 'the-warchest'],
                    hand: ['tactical-officer-moon', 'brain-eater']
                },
                player2: {
                    inPlay: ['sequis', 'zorg', 'commander-remiel', 'mindwarper']
                }
            });

            this.player1.play(this.tacticalOfficerMoon);
        });

        it('should prompt to pick a player', function () {
            expect(this.player1).toHavePrompt("Which player's battleline do you want to rearrange");
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton("Opponent's");
        });

        describe('and my side is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Mine');
            });

            it("should allow creatures to be selected from player1's battleline", function () {
                expect(this.player1).toBeAbleToSelect(this.batdrone);
                expect(this.player1).toBeAbleToSelect(this.troll);
            });

            it('should not be able to select creatures on the opponent battlelline', function () {
                expect(this.player1).not.toBeAbleToSelect(this.zorg);
                expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            });

            it('should not be able to select anything other than in play creatures', function () {
                expect(this.player1).not.toBeAbleToSelect(this.brainEater);
                expect(this.player1).not.toBeAbleToSelect(this.theWarchest);
            });

            describe('and 2 creatures are selected and done is clicked', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.batdrone);
                    this.player1.clickCard(this.troll);
                    this.player1.clickPrompt('done');
                });

                it('should swap those two creatures', function () {
                    expect(this.player1.player.creaturesInPlay[0]).toBe(this.troll);
                    expect(this.player1.player.creaturesInPlay[1]).toBe(this.batdrone);
                });
            });

            describe('and done is clicked', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('done');
                });

                it('the resolution finishes', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('and opponent side is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt("Opponent's");
            });

            it('should allow creatures to be selected from my battleline', function () {
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.mindwarper);
            });

            it("should not be able to select creatures on player1's battlelline", function () {
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
            });
        });
    });
});
