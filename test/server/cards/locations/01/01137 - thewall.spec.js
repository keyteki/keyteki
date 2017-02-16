/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const TheWall = require('../../../../../server/game/cards/locations/01/thewall.js');

describe('TheWall', function() {
    describe('integration', function() {
        const Game = require('../../../../../server/game/game.js');
        const Player = require('../../../../../server/game/player.js');
        const DrawCard = require('../../../../../server/game/drawcard.js');

        describe('when dupes are put out in the setup phase', function() {
            beforeEach(function() {
                this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
                this.game = new Game(null, {}, { gameRepository: this.gameRepository });

                this.player = new Player(1, { username: 'foo' }, false, this.game);

                this.game.playersAndSpectators['foo'] = this.player;
                this.game.initialise();

                this.game.currentPhase = 'setup';
                this.player.phase = 'setup';
                this.player.gold = 10;

                var wallData = { 'pack_code' : 'Core', 'pack_name' : 'Core Set', 'type_code' : 'location', 'type_name' : 'Location', 'faction_code' : 'thenightswatch', 'faction_name' : 'The Night\'s Watch', 'position' : 137, 'code' : '01137', 'name' : 'The Wall', 'cost' : 4, 'text' : 'Each [thenightswatch] character you control gets +1 STR.\n<b>Forced Reaction:</b> After you lose an unopposed challenge, kneel The Wall.\n<b>Interrupt:</b> When the challenges phase ends, kneel The Wall to gain 2 power for your faction.', 'quantity' : 1, 'income' : null, 'initiative' : null, 'claim' : null, 'reserve' : null, 'deck_limit' : 3, 'strength' : null, 'traits' : 'Stronghold. The North.', 'flavor' : null, 'illustrator' : 'Lino Drieghe', 'is_unique' : true, 'is_loyal' : false, 'is_military' : false, 'is_intrigue' : false, 'is_power' : false, 'octgn_id' : '5d20e021-5d12-4338-8bdd-42d008bff919', 'url' : 'https://thronesdb.com/card/01137', 'imagesrc' : '/bundles/cards/01137.png', 'label' : 'The Wall', 'ci' : 4, 'si' : -1 };

                this.wall1 = new TheWall(this.player, wallData);
                this.wall1.location = 'draw deck';
                this.wall2 = new TheWall(this.player, wallData);
                this.wall2.location = 'draw deck';
                this.character = new DrawCard(this.player, { faction_code: this.wall1.getFaction(), type_code: 'character', strength: 1, cost: 0 });
                this.character.location = 'draw deck';


                this.player.drawDeck = _([this.wall1, this.wall2, this.character]);
                this.player.moveCard(this.wall1, 'hand');
                this.player.moveCard(this.wall2, 'hand');
                this.player.moveCard(this.character, 'hand');
                this.player.keep();
                this.player.startGame();
            });

            it('should not count duplicates toward character strength', function() {
                this.game.playCard(this.player.name, this.wall1.uuid, false, this.player.hand);
                this.game.playCard(this.player.name, this.wall2.uuid, false, this.player.hand);
                this.game.playCard(this.player.name, this.character.uuid, false, this.player.hand);
                this.player.setupDone();
                this.player.startPlotPhase();
                this.player.phase = 'plot';
                this.game.currentPhase = 'plot';
                // Resolve events in pipeline.
                this.game.continue();
                expect(this.wall1.dupes.size()).toBe(1);
                expect(this.player.cardsInPlay.size()).toBe(2);
                expect(this.character.getStrength()).toBe(2);
            });
        });
    });
});
