describe('Creed of Nurture', function () {
    describe("Creed of Nurture's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 0,
                    hand: ['eldest-bear', 'snufflegator'],
                    inPlay: ['firespitter', 'creed-of-nurture']
                },
                player2: {
                    inPlay: ['briar-grubbling', 'troll']
                }
            });
        });

        it('should sacrifice Creed of Nurture, and prompt the player to choose two creatures', function () {
            this.player1.clickCard(this.creedOfNurture);
            expect(this.player1).toHavePrompt('Creed of Nurture');
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.creedOfNurture.location).toBe('discard');
            expect(this.player1).toHavePrompt('Creed of Nurture');
            expect(this.player1).toBeAbleToSelect(this.eldestBear);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.firespitter);
            expect(this.player1).not.toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.eldestBear);
            expect(this.player1).toHavePrompt('Creed of Nurture');
            expect(this.player1).not.toBeAbleToSelect(this.eldestBear);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.firespitter);
            expect(this.player1).isReadyToTakeAction();
            expect(this.firespitter.hasTrait('witch')).toBe(true);
            expect(this.firespitter.getKeywordValue('assault')).toBe(3);
        });

        it('should resolve printed and gained before fight abilities correctly', function () {
            this.player1.clickCard(this.creedOfNurture);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.eldestBear);
            this.player1.clickCard(this.firespitter);
            this.player1.fightWith(this.firespitter, this.briarGrubbling);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.firespitter);

            // Eldest Bear 2 amber
            this.player1.clickCard(this.firespitter);
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            expect(this.player1.currentPrompt().buttons[0].values.card).toBe('Firespitter');
            expect(this.player1.currentPrompt().buttons[1].text).toBe('Assault');
            expect(this.player1.currentPrompt().buttons[2].values.card).toBe('Firespitter');
            expect(this.player1.currentPrompt().buttons[3].text).toBe('Autoresolve');
            expect(this.player1.currentPrompt().buttons[4].text).toBe('Back');
            expect(this.player1.currentPrompt().buttons[5]).toBe(undefined);
            this.player1.clickPrompt('Firespitter', 1); // Eldest Bear's constant ability generated a new ability on Firespitter
            expect(this.player1.amber).toBe(2);

            // Firespitter 1 damage
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            this.player1.clickCard(this.firespitter);
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            expect(this.player1.currentPrompt().buttons[0].values.card).toBe('Firespitter');
            expect(this.player1.currentPrompt().buttons[1].text).toBe('Assault');
            expect(this.player1.currentPrompt().buttons[2].text).toBe('Autoresolve');
            expect(this.player1.currentPrompt().buttons[3].text).toBe('Back');
            expect(this.player1.currentPrompt().buttons[4]).toBe(undefined);
            this.player1.clickPrompt('Firespitter');
            expect(this.briarGrubbling.damage).toBe(1);
            expect(this.troll.damage).toBe(1);

            // Briar Grubbling hazardous
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            this.player1.clickCard(this.briarGrubbling);
            expect(this.firespitter.damage).toBe(4);

            // Autoresolve assault, no fight
            expect(this.briarGrubbling.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
