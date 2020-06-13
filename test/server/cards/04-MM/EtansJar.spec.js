xdescribe("Etan's Jar", function () {
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
                    });

                    it('should not allow cards of that name to be played', function () {
                        this.player2.clickCard(this.badPenny);

                        expect(this.player2).not.toHavePromptButton('Play this creature');
                    });
                });
            });
        });
    });
});
