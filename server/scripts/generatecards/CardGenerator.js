/*eslint no-console:0 */

const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const nunjucks = require('nunjucks');
const peg = require('pegjs');

class CardGenerator {
    constructor(dataSource, fullOutputDir, partialOutputDir, comments) {
        this.dataSource = dataSource;
        this.fullOutputDir = fullOutputDir;
        this.partialOutputDir = partialOutputDir;
        this.template = 'Card.njk';
        this.dataDump = 'abilities.json';
        this.comments = comments;
        try {
            console.log('Starting card parser');
            let grammar = fs.readFileSync(path.join(__dirname, 'keyforgeGrammar.pegjs'), 'utf8');
            this.parser = peg.generate(grammar);
            console.log('Card parser started');
        } catch (err) {
            console.log('Could not set up parser');
            console.log(err);
        }

        this.complete = 0;
        this.partial = 0;
        this.skipped = 0;
        this.error = 0;
    }

    async generate() {
        try {
            await this.generateCards();
        } catch (e) {
            console.log('Unable to fetch data', e);
        }
    }

    async generateCards() {
        console.log('Clearing out previously generated cards');
        console.log('Loading card information');
        let cards = await this.dataSource.getCards();
        cards = cards.sort((a, b) => ((a.expansion || 999) > (b.expansion || 999) ? -1 : 1));

        let expansionPaths = {
            CotA: '01-Core',
            AoA: '02-AoA',
            WC: '03-WC',
            MM: '04-MM',
            DT: '05-DT',
            WoE: '06-WoE'
        };

        let cardsById = _.groupBy(cards, (card) => card.id);
        cards = Object.values(cardsById).map((duplicates) =>
            Object.assign(duplicates[0], {
                folder: expansionPaths[duplicates[duplicates.length - 1].packCode]
            })
        );

        //We are not generating HTML and we are not using an input that is a very sensible attack vector so there's not much point escaping everything.
        var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname), {
            autoescape: false
        });

        env.addFilter('gainAbility', gainAbility);
        env.addFilter('itIs', itIs);
        env.addFilter('playerIs', playerIs);
        env.addFilter('eventPlayerIs', eventPlayerIs);
        env.addFilter('check', check);
        env.addFilter('targetted', targetted);
        env.addFilter('then', then);
        env.addFilter('filteredType', filteredType);
        env.addFilter('filteredController', filteredController);
        env.addFilter('isTargetted', isTargetted);
        env.addFilter('findEventListeners', findEventListeners);

        console.log('Card information loaded');

        let allAbilities = {};
        for (let card of cards) {
            if (card.id === '') {
                card.id = `${card.packCode}-${card.number}`;
                card.name = `${card.packCode}${card.number}`;
            } else if (this.camelCase(card.name) === '') {
                card.name = card.id;
            }
            let baseName = card.name.replace(/ *\(Evil Twin\)/, '');
            let simplifiedText = card.text
                .split(baseName)
                .join('$this')
                //.replace(/[\f\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, '\n')
                .replace(/[\u202f\ufeff]/g, ' ')
                .replace(/[\v]/g, '\n');
            let abilities = this.parseAbilities(simplifiedText);
            let data = {
                name: this.camelCase(card.name),
                card: card,
                abilities: abilities,
                shortAbilities: JSON.stringify(abilities, replacer, 2),
                text: simplifiedText.split(/[\n\r]+/g),
                comments: this.comments,
                refs: baseRefs()
            };

            if (data.abilities == null) {
                console.log(`Null abilities for ${card.id}`);
                this.error++;
                continue;
            }

            allAbilities[card.name] = data.abilities;

            let complete = isComplete(data.abilities);
            let skippable = ['reminderText', 'keywords'];
            if (complete && data.abilities.every((ability) => skippable.includes(ability.name))) {
                this.skipped++;
                continue;
            }

            let dir = complete ? this.fullOutputDir : this.partialOutputDir;
            let filename = path.join(dir, card.folder, `${data.name}.js`);
            let a = this;

            try {
                var str = env.render(this.template, data);
                ensureDirectoryExistence(filename);
                fs.writeFileSync(filename, str);
                if (complete) a.complete++;
                else a.partial++;
            } catch (err) {
                console.log(`Failure when generating code from parsed abilities for ${card.id}`);
                console.log(JSON.stringify(data.abilities, null, 1));
                console.log(`error:${err}`);
                this.error++;
            }
        }
        fs.writeFileSync(this.dataDump, JSON.stringify(allAbilities, replacer, 2));
        console.info(this.complete + ' cards completely converted');
        console.info(this.partial + ' cards partially converted');
        console.info(this.skipped + ' cards skipped');
        console.info(this.error + ' cards failed');
    }

    parseAbilities(text) {
        try {
            return this.parser.parse(text);
        } catch (err) {
            console.log('Could not parse abilities: ');
            console.log(text);
            console.log(err.message);
            console.log(JSON.stringify(err.location));
            //console.log(`???: ${JSON.stringify(err)}`);
        }
    }

    camelCase(name) {
        let digitStrings = [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine'
        ];
        return name
            .toLowerCase()
            .replace(/^[0-9]/, (m) => digitStrings[parseInt(m)])
            .replace(/[()'’*]/g, '')
            .replace('æ', 'a')
            .replace(/\b([A-Za-zæ])/g, (m, chr) => chr.toUpperCase())
            .replace(/[,?.!"„“” \-[\]]/g, '');
    }
}

function replacer(key, value) {
    if (value === null || value === false || (Array.isArray(value) && value.length == 0))
        return undefined;
    return value;
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function isComplete(abilities) {
    try {
        return isCompleteInternal(abilities);
    } catch (err) {
        console.log(JSON.stringify(abilities, null, 2));
        console.log(err);
    }
}

function isCompleteInternal(abilities) {
    return (
        abilities === null ||
        typeof abilities === 'string' ||
        typeof abilities === 'number' ||
        typeof abilities === 'boolean' ||
        (abilities.name !== 'unknown' && Object.values(abilities).every(isCompleteInternal))
    );
}

/*

Raw syntax tree 
->
Ability tree

EFFECTS are longer lasting
ACTIONS are instantaneous

Arrays of effects don't really need sorting out, timewise... but may still reference previous effects.

Arrays of actions do.

Ordering matters - they should be (somewhat) sequential.


Actions can be manually or automatically targetted. They can be conditional. Some automatically targetted abilities require that automatic target to be resolved. 
Manually targetted abilities must be structured so that they prompt the player correctly.



Ideally, most (or all) of this process should be in the parsing stage so that the produced metadata is correct.

References to previous targets affect sequencing in a variety of ways.

One tricky thing is...
Combining the "boxes" or "trigger points" that contain multiple actions, when the cards aren't worded that way. Code actions don't easily support targets, sequencing or conditions. But card actions do. So a card action maps closest to a "CardAbility"?

Step 1 - FULLY understand requirements of a given action, not just a basic scan. Requirements include: New, explicit target. Explicit or implicit sequencing. Implicit reliance on another target. Conditions.

Explicit target: Choose/a creature etc.
Implicit target: That creature/it.

Explicit, strong sequencing: If you do/then.
Implicit, strong sequencing: Reliance on event information, or a target chosen after the effect.
Implicit weak sequencing: Important action like ready + fight.

step 2 - using that, construct card abilities, then, targets, arrays etc.*/

function isTargetted(effect) {
    let untargettedModes = ['all', 'self', 'this', 'it'];
    return effect.target && !untargettedModes.includes(effect.target.mode);
}

function baseRefs() {
    return {
        this: 'context.source',
        it: 'context.target',
        player: 'context.player',
        eventPlayer: 'event.player',
        attached: 'context.source.parent',
        check: 'card',
        thenDepth: 1,
        thenContext: null,
        nextThenContext: 'preThenContext',
        filteredType: null,
        filteredController: false
    };
}

function gainAbility(refs) {
    return Object.assign({}, refs, { this: 'this', attached: 'context.source' });
}

function itIs(refs, it) {
    return Object.assign({}, refs, { it });
}

function playerIs(refs, player) {
    return Object.assign({}, refs, { player });
}

function eventPlayerIs(refs, eventPlayer) {
    return Object.assign({}, refs, { eventPlayer });
}

function check(refs, card) {
    return Object.assign({}, refs, { check: card });
}

function then(refs) {
    let thenDepth = refs.thenDepth + 1;
    return Object.assign({}, refs, {
        thenDepth,
        thenContext: refs.nextThenContext,
        nextThenContext: `preThen${thenDepth}Context`
    });
}

function targetted(refs, target) {
    return Object.assign({}, refs, { location: target.location });
}

function filteredType(refs, filteredType) {
    return Object.assign({}, refs, { filteredType });
}

function filteredController(refs, filteredController = true) {
    return Object.assign({}, refs, { filteredController });
}

function findEventListeners(abilities) {
    if (abilities === null || typeof abilities !== 'object') return [];
    let listeners = Object.values(abilities).flatMap(findEventListeners);
    if (abilities.name === 'eventCount') listeners.push(abilities.action);
    return _.uniq(listeners);
}

module.exports = CardGenerator;
