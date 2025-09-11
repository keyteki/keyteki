describe('Antanagoge', function () {
    describe("Antanagoge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['antanagoge'],
                    inPlay: ['daughter'],
                    discard: ['sci-officer-morpheus']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'troll', 'bumpsy']
                }
            });
        });

        describe('Play ability', function () {
            it('should allow grafting an enemy creature', function () {
                this.player1.playCreature(this.antanagoge);
                expect(this.player1).toBeAbleToSelect(this.nexus);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bumpsy);
                expect(this.player1).not.toBeAbleToSelect(this.daughter);
                expect(this.player1).not.toBeAbleToSelect(this.antanagoge);
                this.player1.clickCard(this.nexus);
                expect(this.nexus.parent).toBe(this.antanagoge);
                expect(this.nexus.location).toBe('grafted');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('Reap ability', function () {
            beforeEach(function () {
                this.player1.playCreature(this.antanagoge);
                this.player1.clickCard(this.nexus);
                this.antanagoge.exhausted = false;
            });

            it('should deal damage equal to grafted creature power to all creatures', function () {
                this.player1.reap(this.antanagoge);
                expect(this.player1).toBeAbleToSelect(this.nexus);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
                expect(this.player1).not.toBeAbleToSelect(this.daughter);
                expect(this.player1).not.toBeAbleToSelect(this.antanagoge);
                this.player1.clickCard(this.nexus);

                expect(this.troll.tokens.damage).toBe(3);
                expect(this.bumpsy.tokens.damage).toBe(3);
                expect(this.daughter.tokens.damage).toBeUndefined();
                expect(this.daughter.location).toBe('discard');
                expect(this.antanagoge.tokens.damage).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should not deal damage if no creature is grafted', function () {
                this.player1.moveCard(this.nexus, 'discard');
                this.player1.reap(this.antanagoge);
                expect(this.troll.tokens.damage).toBeUndefined();
                expect(this.bumpsy.tokens.damage).toBeUndefined();
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('With Sci Officer Morpheus', function () {
            beforeEach(function () {
                this.player1.moveCard(this.sciOfficerMorpheus, 'play area');
                this.player1.playCreature(this.antanagoge);
                this.player1.clickCard(this.sciOfficerMorpheus);
                this.player1.clickCard(this.nexus);
                this.player1.clickCard(this.troll);
                this.antanagoge.exhausted = false;
            });

            it('should allow grafting two creatures', function () {
                expect(this.nexus.parent).toBe(this.antanagoge);
                expect(this.nexus.location).toBe('grafted');
                expect(this.troll.parent).toBe(this.antanagoge);
                expect(this.troll.location).toBe('grafted');
            });

            it('should prompt to choose which grafted creature to use for damage', function () {
                this.player1.reap(this.antanagoge);
                expect(this.player1).toBeAbleToSelect(this.nexus);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
                expect(this.player1).not.toBeAbleToSelect(this.daughter);
                expect(this.player1).not.toBeAbleToSelect(this.antanagoge);
                this.player1.clickCard(this.troll);
                expect(this.bumpsy.location).toBe('discard');
                expect(this.daughter.location).toBe('discard');
                expect(this.antanagoge.location).toBe('discard');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
