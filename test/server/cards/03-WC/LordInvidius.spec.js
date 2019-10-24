fdescribe('Lord Invidius', function() {
    integration(function() {
        describe('while is it not in the centre of the battle line', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['lord-invidius', 'troll', 'dominator-bauble']
                    },
                    player2: {
                        inPlay: ['urchin', 'seeker-needle', 'mighty-javelin', 'library-of-babble', 'the-sting']
                    }
                });
            });

            it('should not gain a reap ability', function () {
                this.player1.reap(this.lordInvidius);

                expect(this.player1).not.toHavePromptButton('Choose a creature');
            });
        });

        describe('while it is in the centre of the battle line', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['troll', 'lord-invidius', 'dominator-bauble']
                    },
                    player2: {
                        inPlay: ['urchin', 'seeker-needle', 'mighty-javelin', 'library-of-babble', 'the-sting']
                    }
                });
            });

            it('should gain a reap ability', function() {
                this.player1.reap(this.lordInvidius);

                expect(this.player1).toHavePrompt('Choose a creature');
            });
        });
    });
});
