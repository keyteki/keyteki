describe('The Grim Reaper(WC)', function () {
    describe('Playing the Grim Reaper:', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['the-grim-reaper', 'anger'],
                    discard: [
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke'
                    ]
                },
                player2: {
                    house: 'brobnar',
                    hand: ['poke'],
                    discard: [
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke',
                        'poke'
                    ]
                }
            });
        });

        it('with 9 cards in discard, grim reaper should enter exhausted', function () {
            expect(this.player1.player.isHaunted()).toBe(false);
            expect(this.player2.player.isHaunted()).toBe(true);
            this.player1.play(this.theGrimReaper);
            expect(this.theGrimReaper.exhausted).toBe(true);
        });

        it('with 10 cards in discard, grim reaper should enter ready', function () {
            this.player1.moveCard(this.anger, 'discard');
            expect(this.player1.player.isHaunted()).toBe(true);
            this.player1.play(this.theGrimReaper);
            expect(this.theGrimReaper.exhausted).toBe(false);
            expect(this).toHaveRecentChatMessage(
                'player1 uses The Grim Reaper to ready The Grim Reaper'
            );
        });
    });
});

describe('Playing the Grim Reaper:', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'brobnar',
                inPlay: ['the-grim-reaper'],
                hand: ['troll']
            },
            player2: {
                house: 'brobnar',
                hand: ['krump', 'groggins']
            }
        });
    });

    it('should ask to purge a friendly creature', function () {
        this.player1.reap(this.theGrimReaper);
        expect(this.player1).toHavePrompt('Choose a friendly creature to purge');
        this.player1.clickCard(this.theGrimReaper);
        expect(this.theGrimReaper.location).toBe('purged');
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
    });

    it('should ask to purge a friendly and an enemy creature', function () {
        this.player1.moveCard(this.troll, 'play area');
        this.player2.moveCard(this.krump, 'play area');
        this.player2.moveCard(this.groggins, 'play area');

        this.player1.reap(this.theGrimReaper);
        expect(this.player1).toHavePrompt('Choose an enemy creature to purge');
        expect(this.player1).toBeAbleToSelect(this.krump);
        expect(this.player1).toBeAbleToSelect(this.groggins);
        this.player1.clickCard(this.groggins);
        expect(this.player1).toHavePrompt('Choose a friendly creature to purge');
        expect(this.player1).toBeAbleToSelect(this.theGrimReaper);
        expect(this.player1).toBeAbleToSelect(this.troll);
        this.player1.clickCard(this.troll);
        expect(this.groggins.location).toBe('purged');
        expect(this.troll.location).toBe('purged');
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
    });
});
