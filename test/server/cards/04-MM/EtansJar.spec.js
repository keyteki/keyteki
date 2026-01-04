describe("Etan's Jar", function () {
    describe('play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['etan-s-jar', 'shadow-self'],
                    inPlay: ['gamgee', 'troll']
                },
                player2: {
                    amber: 2,
                    inPlay: ['knuckles-bolton', 'pip-pip'],
                    hand: ['bad-penny', 'blossom-drake']
                }
            });
        });

        describe('when the card is played', function () {
            beforeEach(function () {
                this.player1.play(this.etanSJar);
            });

            it('should prompt for a card name', function () {
                expect(this.player1).toHavePrompt('Name a card');
            });

            describe('when a card name is selected', function () {
                beforeEach(function () {
                    this.player1.selectCardName('Bad Penny');
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                });

                it('should not allow cards of that name to be played', function () {
                    this.player2.clickCard(this.badPenny);
                    expect(this.player2).not.toHavePromptButton('Play this creature');
                });

                it('should last for multiple rounds', function () {
                    this.player2.endTurn();
                    this.player1.clickPrompt('dis');
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.clickCard(this.badPenny);
                    expect(this.player2).not.toHavePromptButton('Play this creature');
                });

                describe("when Etan's Jar leaves play", function () {
                    beforeEach(function () {
                        this.player1.player.moveCard(this.etanSJar, 'discard');
                    });

                    it('should be able to play cards of that name again', function () {
                        this.player2.clickCard(this.badPenny);
                        expect(this.player2).toHavePromptButton('Play this creature');
                    });
                });

                describe("when an in-play Etan's Jar is blanked", function () {
                    beforeEach(function () {
                        this.player2.player.moveCard(this.blossomDrake, 'play area');
                    });

                    it('should not be able to play cards of that name', function () {
                        this.player2.clickCard(this.badPenny);
                        expect(this.player2).not.toHavePromptButton('Play this creature');
                    });
                });
            });
        });
    });
});
