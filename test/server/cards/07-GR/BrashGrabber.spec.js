describe('Brash Grabber', function () {
    describe('is played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['brash-grabber', 'blypyp'],
                    inPlay: ['gub'],
                    discard: new Array(9).fill('poke') // not haunted
                },
                player2: {
                    inPlay: ['batdrone', 'daughter', 'chronus']
                }
            });
            this.gub.amber = 1;
            this.batdrone.amber = 2;
            this.daughter.amber = 2;
        });

        it('enters enraged when not haunted', function () {
            this.player1.playCreature(this.brashGrabber);
            expect(this.brashGrabber.enraged).toBe(true);
        });

        it('does not enter when haunted', function () {
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Discard this card');
            this.player1.playCreature(this.brashGrabber);
            expect(this.brashGrabber.enraged).toBe(false);
        });

        it('omni takes 1A', function () {
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Discard this card');
            this.player1.playCreature(this.brashGrabber);
            this.brashGrabber.ready();
            this.player1.clickCard(this.brashGrabber);
            expect(this.player1).toHavePrompt('Brash Grabber');
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Brash Grabber');
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.daughter);
            expect(this.player1).not.toBeAbleToSelect(this.chronus);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.amber).toBe(1);
            expect(this.batdrone.amber).toBe(1);
            expect(this.daughter.amber).toBe(2);
        });
    });
});
