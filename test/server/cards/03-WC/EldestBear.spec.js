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
                    hand: ['harland-mindlock', 'fyre-breath', 'soulkeeper'],
                    inPlay: []
                },
                player2: {
                    inPlay: ['eldest-bear', 'troll'],
                    hand: ['fyre-breath']
                }
            });
            this.player1.makeMaverick(this.fyreBreath, logos);
            this.player1.makeMaverick(this.soukeeper, logos);
        });

        it('regains the before-fight gain-amber ability after returning to the centre', function () {
            this.player2.play(this.harlandMindlock);
            this.player2.clickCard(/* a player1 flank creature */);

            // 2. Attach Fyre Breath to Eldest Bear so it gains the extra
            //    "Before Fight: deal 2 damage to neighbours" trigger.
            this.player1.playUpgrade(this.fyreBreath, this.eldestBear);

            // 3. Eldest Bear (in centre) fights Harland Mindlock.
            //    Triggers queued: gain-amber, Assault 3, Fyre Breath neighbour damage.
            this.player1.fightWith(this.eldestBear, this.harlandMindlock);

            // 4. Resolve gain-amber first while Eldest is still in the centre.
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Gain 2 amber');
            expect(this.player1.amber).toBe(2);

            // 5. Resolve Assault — kills Harland Mindlock.
            //    Harland leaving play returns the stolen creature to player1, growing
            //    player1's battle line and pushing Eldest Bear off the centre.
            this.player1.clickPrompt('Assault');
            expect(this.harlandMindlock.location).toBe('discard');
            expect(this.eldestBear.isInCenter()).toBe(false);

            // 6. Resolve Fyre Breath's neighbour damage on one of Harland's neighbours,
            //    which has Soulkeeper attached. The neighbour dies, triggering Soulkeeper
            //    to destroy the most powerful enemy (a friendly player1 creature),
            //    shrinking player1's battle line so Eldest Bear is back in the centre.
            this.player1.clickPrompt('Fyre Breath');
            expect(this.eldestBear.isInCenter()).toBe(true);

            // 7. On a later turn, Eldest Bear fights again — the gain-amber ability
            //    should be available because Eldest is back in the centre.
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            this.player1.fightWith(this.eldestBear /* another enemy creature */);
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Gain 2 amber');
            expect(this.player1.amber).toBe(4);
        });
    });
});
