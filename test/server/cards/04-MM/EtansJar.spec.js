describe("Etan's Jar", function () {
    integration(function () {
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
                        hand: ['bad-penny']
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
                        this.player2.clickCard(this.badPenny);
                    });

                    it('should not allow cards of that name to be played', function () {
                        expect(this.player2).not.toHavePromptButton('Play this creature');
                    });

                    describe('when etans jar leaves play', function () {
                        beforeEach(function () {
                            this.player1.player.moveCard(this.etanSJar, 'discard');

                            this.player2.clickPrompt('cancel');
                            this.player2.clickCard(this.badPenny);
                        });

                        xit('should be able to play cards of that name again', function () {
                            expect(this.player2).toHavePromptButton('Play this creature');
                        });
                    });
                });
            });
        });
    });
});
