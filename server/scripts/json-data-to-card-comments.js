#!/usr/bin/env node
/*
 * Rewrites the leading `//` comment block of each card implementation in
 * server/game/cards/<set-folder>/ so that it matches the card text in
 * keyteki-json-data/packs/<SET>.json verbatim, with icons translated to
 * plain ASCII per project convention.
 *
 * Usage:
 *   node server/scripts/json-data-to-card-comments.js <SET> [--write] [--list]
 *
 * <SET> is the json-data pack code (e.g. DM, CC, MM). The matching card
 * folder is auto-detected by suffix (e.g. server/game/cards/14-DM).
 *
 * Without --write the script does a dry run and only reports counts.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));
const setCode = positional[0];

if (!setCode) {
    console.error(
        'Usage: node server/scripts/json-data-to-card-comments.js <SET> [--write] [--list]'
    );
    process.exit(1);
}

const jsonPath = path.join(ROOT, 'keyteki-json-data', 'packs', `${setCode}.json`);
if (!fs.existsSync(jsonPath)) {
    console.error(`No pack JSON at ${jsonPath}`);
    process.exit(1);
}

const cardsRoot = path.join(ROOT, 'server', 'game', 'cards');
const folder = fs
    .readdirSync(cardsRoot)
    .find((name) => name.endsWith(`-${setCode}`) || name === setCode);
if (!folder) {
    console.error(`No card folder for set ${setCode} under ${cardsRoot}`);
    process.exit(1);
}
const cardDir = path.join(cardsRoot, folder);

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const byId = new Map();
for (const c of data.cards) {
    if (!byId.has(c.id)) {
        byId.set(c.id, c);
    }
}

// PUA bonus-icon code points → plain word.
// Pairs (capture spans two glyphs) are handled before this map is consulted.
const ICON_MAP = {
    '\uF360': 'amber',
    '\uF361': 'damage',
    '\uF36E': 'draw',
    '\uF36F': 'capture',
    '\uF560': 'capture',
    '\uF372': 'discard',
    '\uF37B': 'ekwidon',
    '\uF37C': 'geistoid',
    '\uF37E': 'mars',
    '\uF37F': 'skyborn',
    '\uF389': 'shadows',
    '\uF390': 'unfathomable',
    '\uF391': 'ouboros',
    '\uF392': 'power'
};

function normalize(text) {
    let t = text;
    // Number followed by amber/damage in inline text: "1\uF360" -> "1A", "4\uF361" -> "4 damage"
    t = t.replace(/(\d) ?\uF360/g, '$1A');
    t = t.replace(/(\d) ?\uF361/g, '$1 damage');
    // Capture is rendered as a pair of glyphs; collapse to a single " capture"
    t = t.replace(/\uF36F\uF560|\uF560\uF36F/g, ' capture');
    // Any remaining bonus-icon code point becomes " <word>"
    t = t.replace(/[\uE000-\uF8FF]/g, (c) => {
        const word = ICON_MAP[c];
        return word ? ' ' + word : c;
    });
    // Smart quotes -> straight
    t = t.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
    // Non-breaking space -> regular space
    t = t.replace(/\u00A0/g, ' ');
    // Collapse runs of spaces/tabs (preserve newlines)
    t = t.replace(/[ \t]+/g, ' ');
    // Strip space before common punctuation
    t = t.replace(/ ([.,;:!?])/g, '$1');
    // Trim trailing whitespace from each line and trailing blank lines
    t = t
        .split('\n')
        .map((l) => l.replace(/[ \t]+$/g, ''))
        .join('\n')
        .replace(/\n+$/g, '');
    return t;
}

function buildCommentLines(text, indent) {
    const norm = normalize(text);
    return norm.split('\n').map((l) => (l ? `${indent}// ${l}` : `${indent}//`));
}

const files = fs.readdirSync(cardDir).filter((f) => f.endsWith('.js'));
const results = { updated: [], unchanged: [], skipped: [], missing: [] };

for (const file of files) {
    const fp = path.join(cardDir, file);
    const src = fs.readFileSync(fp, 'utf8');

    const idMatches = [...src.matchAll(/^([A-Za-z0-9_]+)\.id\s*=\s*'([^']+)';/gm)];
    if (!idMatches.length) {
        results.skipped.push(`${file}: no .id assignment`);
        continue;
    }
    const cardId = idMatches[0][2];
    const card = byId.get(cardId);
    if (!card) {
        results.missing.push(`${file}: id '${cardId}' not in ${setCode}.json`);
        continue;
    }

    const classRe = /^(class\s+\w+\s+extends\s+\w+\s*\{\s*\n)/m;
    const classMatch = src.match(classRe);
    if (!classMatch) {
        results.skipped.push(`${file}: no class declaration`);
        continue;
    }
    const classBodyStart = classMatch.index + classMatch[0].length;

    const after = src.slice(classBodyStart);
    const afterLines = after.split('\n');

    let indent = '    ';
    for (const l of afterLines) {
        const m = l.match(/^([ \t]+)\S/);
        if (m) {
            indent = m[1];
            break;
        }
    }

    // Detect existing leading `//` comment block (consecutive comment lines
    // at the top of the class body). Stop on the first non-comment line.
    let endLine = 0;
    const commentRe = new RegExp(`^${indent}//`);
    for (let i = 0; i < afterLines.length; i++) {
        if (commentRe.test(afterLines[i])) {
            endLine = i + 1;
        } else {
            break;
        }
    }

    const newComment = buildCommentLines(card.text || '', indent).join('\n');
    let newAfter;
    if (endLine > 0) {
        newAfter = newComment + '\n' + afterLines.slice(endLine).join('\n');
    } else {
        newAfter = newComment + '\n' + afterLines.join('\n');
    }
    const newSrc = src.slice(0, classBodyStart) + newAfter;

    if (newSrc === src) {
        results.unchanged.push(file);
    } else {
        if (flags.has('--write')) {
            fs.writeFileSync(fp, newSrc);
        }
        results.updated.push(file);
    }
}

console.log(`Set: ${setCode}  Folder: ${path.relative(ROOT, cardDir)}`);
console.log(`Files: ${files.length}`);
console.log(`  Updated:        ${results.updated.length}`);
console.log(`  Unchanged:      ${results.unchanged.length}`);
console.log(`  Skipped:        ${results.skipped.length}`);
console.log(`  Missing in JSON:${results.missing.length}`);
if (!flags.has('--write')) {
    console.log('(dry run — re-run with --write to apply)');
}
if (results.skipped.length) {
    console.log('SKIPPED:\n  ' + results.skipped.join('\n  '));
}
if (results.missing.length) {
    console.log('MISSING:\n  ' + results.missing.join('\n  '));
}
if (flags.has('--list') && results.updated.length) {
    console.log('UPDATED:\n  ' + results.updated.join('\n  '));
}
