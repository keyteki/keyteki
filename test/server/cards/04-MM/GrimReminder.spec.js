describe('Grim Reminder', function () {
    describe("Grim Reminder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: [
                        'ember-imp',
                        'shooler',
                        'gub',
                        'spyyyder',
                        'troll',
                        'lamindra',
                        'redlock',
                        'alaka'
                    ],
                    hand: ['grim-reminder']
                },
                player2: {
                    amber: 1
                }
            });

            this.player1.moveCard(this.spyyyder, 'discard');
            this.player1.moveCard(this.gub, 'discard');
            this.player1.moveCard(this.lamindra, 'discard');
            this.player1.moveCard(this.troll, 'discard');
        });

        it('should move all selected house creatures to archive', function () {
            this.player1.play(this.grimReminder);
            expect(this.player1).toHavePrompt('Choose a house');
            this.player1.clickPrompt('dis');

            expect(this.shooler.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.redlock.location).toBe('play area');
            expect(this.alaka.location).toBe('play area');

            expect(this.lamindra.location).toBe('discard');
            expect(this.troll.location).toBe('discard');

            expect(this.spyyyder.location).toBe('archives');
            expect(this.gub.location).toBe('archives');

            expect(this.player1.chains).toBe(1);
        });
    });
});
