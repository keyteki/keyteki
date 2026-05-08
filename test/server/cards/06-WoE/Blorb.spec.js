describe('Blorb', function () {
    describe("Blorb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    token: 'blorb',
                    house: 'mars',
                    inPlay: ['blorb:toad'],
                    discard: ['blorb-hive']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });

            this.toad = this.blorb;
        });

        it('should not be able to reap', function () {
            this.player1.clickCard(this.blorb);
            expect(this.player1).not.toHavePrompt('Reap with this Creature');
        });

        it('should evaluate the destroyed ability without a selected target', function () {
            const destroyedAbility = this.blorb.abilities.reactions.find(
                (ability) => ability.properties.destroyed
            );
            const context = destroyedAbility.createContext(this.player1.player);
            let gameActions;

            expect(() => {
                gameActions = destroyedAbility.getGameActions(context);
            }).not.toThrow();
            expect(gameActions).toEqual([]);
        });

        it('bring back Blorb Hive when destroyed', function () {
            this.player1.fightWith(this.blorb, this.umbra);
            this.player1.clickCard(this.blorbHive);
            expect(this.blorbHive.location).toBe('hand');
            expect(this.toad.location).toBe('discard');
        });
    });
});
