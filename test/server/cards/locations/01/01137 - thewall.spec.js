/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('TheWall', function() {
    integration(function() {
        const wallCardData = { 'pack_code' : 'Core', 'pack_name' : 'Core Set', 'type_code' : 'location', 'type_name' : 'Location', 'faction_code' : 'thenightswatch', 'faction_name' : 'The Night\'s Watch', 'position' : 137, 'code' : '01137', 'name' : 'The Wall', 'cost' : 4, 'text' : 'Each [thenightswatch] character you control gets +1 STR.\n<b>Forced Reaction:</b> After you lose an unopposed challenge, kneel The Wall.\n<b>Interrupt:</b> When the challenges phase ends, kneel The Wall to gain 2 power for your faction.', 'quantity' : 1, 'income' : null, 'initiative' : null, 'claim' : null, 'reserve' : null, 'deck_limit' : 3, 'strength' : null, 'traits' : 'Stronghold. The North.', 'flavor' : null, 'illustrator' : 'Lino Drieghe', 'is_unique' : true, 'is_loyal' : false, 'is_military' : false, 'is_intrigue' : false, 'is_power' : false, 'octgn_id' : '5d20e021-5d12-4338-8bdd-42d008bff919', 'url' : 'https://thronesdb.com/card/01137', 'imagesrc' : '/bundles/cards/01137.png', 'label' : 'The Wall', 'ci' : 4, 'si' : -1 };

        const deck = {
            faction: { value: 'thenightswatch' },
            drawCards: [
                { count: 2, card: wallCardData },
                { count: 1, card: { faction_code: 'thenightswatch', name: 'Test Character', type_code: 'character', strength: 1, cost: 0 } }
            ],
            plotCards: []
        };

        describe('when dupes are put out in the setup phase', function() {
            beforeEach(function() {
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.wall1, this.wall2] = this.player1.filterCardsByName('The Wall');
                this.character = this.player1.findCardByName('Test Character');
            });

            it('should not count duplicates toward character strength', function() {
                this.player1.clickCard(this.wall1);
                this.player1.clickCard(this.wall2);
                this.player1.clickCard(this.character);

                this.completeSetup();

                expect(this.wall1.dupes.size()).toBe(1);
                expect(this.player1Object.cardsInPlay.size()).toBe(2);
                expect(this.character.getStrength()).toBe(2);
            });
        });
    });
});
