describe('Purse-A-Phone', function () {
    describe("Purse-A-Phone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    hand: ['shadys'],
                    inPlay: ['purse-a-phone'],
                    discard: ['shadys']
                },
                player2: {
                    amber: 5,
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.shadys = this.player1.discard[0];
            this.shadys2 = this.player1.hand[0];
        });

        it('makes keys cost -2 for opponent', function () {
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(1);
        });

        it('makes keys cost -2 for self', function () {
            this.player2.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
        });

        it('brings back Shadys when destroyed', function () {
            this.player1.fightWith(this.purseAPhone, this.thingFromTheDeep);
            expect(this.player1).not.toHavePrompt('Done'); // not optional
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).not.toBeAbleToSelect(this.shadys2);
            this.player1.clickCard(this.shadys);
            expect(this.shadys.location).toBe('hand');
            expect(this.purseAPhone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows a choice between multiple Shadyses when destroyed', function () {
            this.player1.moveCard(this.shadys2, 'discard');
            this.player1.fightWith(this.purseAPhone, this.thingFromTheDeep);
            expect(this.player1).not.toHavePrompt('Done'); // not optional
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.shadys2);
            this.player1.clickCard(this.shadys2);
            expect(this.shadys.location).toBe('discard');
            expect(this.shadys2.location).toBe('hand');
            expect(this.purseAPhone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing if no Shadys is present', function () {
            this.player1.moveCard(this.shadys, 'deck');
            this.player1.fightWith(this.purseAPhone, this.thingFromTheDeep);
            expect(this.purseAPhone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
