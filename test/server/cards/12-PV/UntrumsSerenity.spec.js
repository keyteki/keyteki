describe("Untrum's Serenity", function () {
    describe("Untrum's Serenity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ritual-of-balance', 'ember-imp', 'krump'],
                    hand: ['troll', 'anger', 'untrum-s-serenity'],
                    archives: ['dust-pixie']
                },
                player2: {
                    inPlay: ['library-of-babble', 'titan-mechanic', 'titan-guardian'],
                    hand: ['timetraveller', 'dextre'],
                    archives: ['poke']
                }
            });
        });

        it('should destroy all creatures and artifacts, discard archives and hands, then refill hands', function () {
            this.player1.play(this.untrumSSerenity);
            expect(this.player1).toHavePrompt('Choose which player discards first'); // archives
            this.player1.clickPrompt('Me');
            expect(this.player1).toHavePrompt('Choose which player discards first'); // hand
            this.player1.clickPrompt('Opponent');
            this.player1.clickPrompt('Autoresolve'); // player1 hand
            expect(this.ritualOfBalance.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.titanGuardian.location).toBe('discard');
            expect(this.titanMechanic.location).toBe('discard');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.dextre.location).toBe('discard');
            expect(this.poke.location).toBe('discard');
            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
            this.player2.clickPrompt('logos');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
