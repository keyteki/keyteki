describe('War Grumpus', function () {
    describe("War Grumpus's fight/reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['war-grumpus', 'bumpsy', 'hobnobber']
                },
                player2: {
                    inPlay: ['urchin', 'troll']
                }
            });
        });

        it('readies and fights with a neighboring giant on fight', function () {
            this.bumpsy.exhaust();
            this.player1.fightWith(this.warGrumpus, this.urchin);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.warGrumpus);
            expect(this.player1).not.toBeAbleToSelect(this.hobnobber);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.troll.damage).toBe(5);
            expect(this.troll.location).toBe('play area');
            expect(this.warGrumpus.damage).toBe(0);
            expect(this.warGrumpus.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('readies and fights with a neighboring giant on reap', function () {
            this.bumpsy.exhaust();
            this.player1.reap(this.warGrumpus);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.warGrumpus);
            expect(this.player1).not.toBeAbleToSelect(this.hobnobber);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.troll.damage).toBe(5);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('War Grumpus with no neighboring giant', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['hobnobber', 'war-grumpus', 'lion-bautrem']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('does nothing when no neighboring creature is a giant', function () {
            this.player1.fightWith(this.warGrumpus, this.urchin);
            expect(this.warGrumpus.location).toBe('play area');
            expect(this.hobnobber.exhausted).toBe(false);
            expect(this.lionBautrem.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
