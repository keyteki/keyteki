describe('Final Refrain', function () {
    describe("Final Refrain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['final-refrain'],
                    inPlay: ['cpo-zytar'],
                    discard: [
                        'stealth-mode',
                        'troll',
                        'medic-ingram',
                        'helmsman-spears',
                        'uncharted-lands',
                        'mimic-gel'
                    ]
                },
                player2: {
                    inPlay: ['batdrone', 'thing-from-the-deep', 'dew-faerie'],
                    discard: ['timetraveller']
                }
            });
            this.player1.moveCard(this.mimicGel, 'deck');
        });

        it('brings each creature in discard back into play ready', function () {
            this.player1.play(this.finalRefrain);

            // Choose which to play.
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.helmsmanSpears);
            expect(this.player1).not.toBeAbleToSelect(this.stealthMode);
            expect(this.player1).not.toBeAbleToSelect(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);

            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.exhausted).toBe(false);
            expect(this.medicIngram.location).toBe('play area');
            expect(this.medicIngram.exhausted).toBe(false);
            expect(this.helmsmanSpears.location).toBe('play area');
            expect(this.helmsmanSpears.exhausted).toBe(false);
        });

        it('fights with each creature', function () {
            this.player1.play(this.finalRefrain);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');

            // Choose which to fight with.
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.helmsmanSpears);
            expect(this.player1).not.toBeAbleToSelect(this.stealthMode);
            expect(this.player1).not.toBeAbleToSelect(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);

            this.player1.clickCard(this.troll);

            // Choose which to fight into.
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.helmsmanSpears);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);

            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.tokens.damage).toBe(8);
            expect(this.troll.location).toBe('discard');

            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.tokens.damage).toBe(11);
            expect(this.medicIngram.location).toBe('discard');

            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.tokens.damage).toBe(13);
            expect(this.helmsmanSpears.location).toBe('discard');

            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys each creature after the fights', function () {
            this.player1.play(this.finalRefrain);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickPrompt('Done'); // spears effect
            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickCard(this.medicIngram); // ward ingram

            expect(this.medicIngram.location).toBe('play area');
            expect(this.medicIngram.tokens.ward).toBe(undefined);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('handles creatures that cannot be put into play', function () {
            this.player1.moveCard(this.mimicGel, 'discard');

            this.player1.play(this.finalRefrain);

            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.mimicGel.location).toBe('discard');

            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickPrompt('Done'); // spears effect
            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickCard(this.medicIngram); // ward ingram

            expect(this.medicIngram.location).toBe('play area');
            expect(this.medicIngram.tokens.ward).toBe(undefined);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
