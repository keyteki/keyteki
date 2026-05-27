describe('Eldest Bear', function () {
    describe("Eldest Bear's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['eldest-bear'],
                    hand: ['dust-pixie', 'dew-faerie']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });
        });
        it("have 'Before Fight: Gain 2A' if in center [1]", function () {
            this.player1.fightWith(this.eldestBear, this.troll);
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Assault');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
        });
        it("not have 'Before Fight: Gain 2A' if not in center [2]", function () {
            this.player1.play(this.dustPixie);
            this.player1.fightWith(this.eldestBear, this.troll);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
        });
        it("have 'Before Fight: Gain 2A' if in center [2]", function () {
            this.player1.play(this.dustPixie);
            this.player1.play(this.dewFaerie, true);
            this.player1.fightWith(this.eldestBear, this.troll);
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Assault');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(6);
        });
    });

    describe('when it leaves and re-enters the centre of the battle line', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['harland-mindlock', 'fyre-breath', 'fyre-breath', 'soulkeeper'],
                    inPlay: ['batdrone', 'bilgewarden', 'infomorph']
                },
                player2: {
                    inPlay: ['eldest-bear', 'frost-giant']
                }
            });
            [this.fyreBreath1, this.fyreBreath2] = this.player1.filterCardsByName(
                'fyre-breath',
                'hand'
            );

            this.player1.makeMaverick(this.fyreBreath1, 'logos');
            this.player1.makeMaverick(this.fyreBreath2, 'logos');
            this.player1.makeMaverick(this.soulkeeper, 'logos');
        });

        it('regains the before-fight gain-amber ability after returning to the centre', function () {
            this.player1.playUpgrade(this.fyreBreath1, this.eldestBear);
            this.player1.playUpgrade(this.fyreBreath2, this.eldestBear);
            this.player1.playUpgrade(this.soulkeeper, this.batdrone);
            this.player1.play(this.harlandMindlock);
            this.player1.clickCard(this.frostGiant);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.eldestBear, this.infomorph);

            // Eldest Bear 2 amber
            expect(this.player2.amber).toBe(0);
            this.player2.clickPrompt(this.eldestBear.name);
            expect(this.player2.amber).toBe(2);

            // Fyre Breath to kill Harland Mindlock
            this.player2.clickPrompt(this.fyreBreath.name);
            expect(this.batdrone.damage).toBe(0);
            expect(this.bilgewarden.location).toBe('discard');
            expect(this.infomorph.damage).toBe(0);
            expect(this.harlandMindlock.location).toBe('discard');
            this.player2.clickPrompt('Left');

            // Soulkeeper to kill Frost Giant
            this.player2.clickPrompt(this.fyreBreath.name);
            expect(this.batdrone.damage).toBe(2);
            this.player2.clickCard(this.frostGiant);
            expect(this.batdrone.location).toBe('discard');
            expect(this.frostGiant.location).toBe('discard');
            expect(this.eldestBear.isInCenter()).toBe(true);
            expect(this.player2.player.creaturesInPlay).toEqual([this.eldestBear]);

            // Assault Infomorph
            this.player2.clickCard(this.eldestBear);
            this.player2.clickPrompt('Assault');

            // Eldest Bear 2 amber auto-resolves
            expect(this.player2.amber).toBe(4);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
