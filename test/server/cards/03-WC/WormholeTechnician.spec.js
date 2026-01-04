describe('Wormhole Technician', function () {
    describe("Wormhole Technician's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['wormhole-technician'],
                    discard: ['virtuous-works', 'hexpion', 'eureka', 'first-blood']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should archive the card if is not of house Logos', function () {
            this.player1.moveCard(this.virtuousWorks, 'deck');
            this.player1.reap(this.wormholeTechnician);
            expect(this.virtuousWorks.location).toBe('archives');
        });

        it('should play the card if it is of house Logos', function () {
            this.player1.moveCard(this.hexpion, 'deck');
            this.player1.reap(this.wormholeTechnician);
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');
            expect(this.hexpion.location).toBe('play area');
        });

        it('should do nothing if deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.reap(this.wormholeTechnician);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not play the card if it is of house Logos and it is alpha', function () {
            this.player1.moveCard(this.eureka, 'deck');
            this.player1.reap(this.wormholeTechnician);
            expect(this.eureka.location).toBe('deck');
        });

        it('should archive the card if it is not of house Logos and it is alpha', function () {
            this.player1.moveCard(this.firstBlood, 'deck');
            this.player1.reap(this.wormholeTechnician);
            expect(this.firstBlood.location).toBe('archives');
        });
    });
});
