#!/usr/bin/env node
/*
 * Interactive scenario picker.
 *
 *   npm run scenario
 *
 * Two pickers (file → test) with VSCode-style subsequence filtering, then it
 * spawns `npm run dev:gamenode` with the right SCENARIO env var. Esc
 * goes back one level; Ctrl+C exits.
 */

// @ts-nocheck

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { spawn } = require('node:child_process');

const { inspectScenario } = require('./runner.js');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const SEARCH_ROOTS = [{ dir: path.join(ROOT, 'test', 'server'), pattern: /\.spec\.js$/ }];

function walk(dir, pattern, out = []) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return out;
    }
    for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, pattern, out);
        } else if (pattern.test(entry.name)) {
            out.push(full);
        }
    }
    return out;
}

function collectFiles() {
    const files = [];
    for (const { dir, pattern } of SEARCH_ROOTS) {
        files.push(...walk(dir, pattern));
    }
    // Scenario mode only works for tests that build a game via `setupTest`.
    // Filter out unit-style specs (mocks, helpers) at the file level so they
    // don't show up in the picker at all.
    const compatible = files.filter((abs) => {
        try {
            return fs.readFileSync(abs, 'utf8').includes('setupTest');
        } catch {
            return false;
        }
    });
    return compatible
        .map((abs) => {
            const rel = path.relative(ROOT, abs);
            const display = rel.replace(/^test\/server\//, '');
            return { abs, rel, display };
        })
        .sort((a, b) => a.display.localeCompare(b.display));
}

// VSCode-style subsequence match: every query char must appear in haystack in
// order. Returns null for no match, otherwise { score, positions }. Lower
// score = better (consecutive matches, earlier position, word starts).
function fuzzyMatch(haystack, needle) {
    if (!needle) return { score: 0, positions: [] };
    const hs = haystack.toLowerCase();
    // Ignore spaces in the query so "mimic gel" matches "mimicgel".
    const ne = needle.toLowerCase().replace(/\s+/g, '');
    if (!ne) return { score: 0, positions: [] };
    const positions = [];
    let hi = 0;
    let score = 0;
    let lastIdx = -2;
    for (let ni = 0; ni < ne.length; ni++) {
        const ch = ne[ni];
        while (hi < hs.length && hs[hi] !== ch) hi++;
        if (hi >= hs.length) return null;
        positions.push(hi);
        // Bonus for consecutive matches
        if (hi !== lastIdx + 1) score += hi - lastIdx;
        // Bonus for word starts
        if (hi === 0 || /[/\s_\-.]/.test(hs[hi - 1])) score -= 2;
        lastIdx = hi;
        hi++;
    }
    return { score, positions };
}

function filterAndRank(items, query, getText) {
    if (!query) return items.map((item) => ({ item, positions: [] }));

    // Items with `.fullText` + `.sep` participate in a tree: match against the
    // full path, then distribute the match positions across the ancestor
    // headers + leaf so each row highlights only the chars in its segment.
    const hasTree = items.some((it) => it && it.fullText);
    if (!hasTree) {
        const ranked = [];
        for (const item of items) {
            const m = fuzzyMatch(getText(item), query);
            if (m) ranked.push({ item, score: m.score, positions: m.positions });
        }
        ranked.sort((a, b) => a.score - b.score);
        return ranked;
    }

    const matches = new Map();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item || item.header) continue;
        const m = fuzzyMatch(item.fullText, query);
        if (m) matches.set(i, m);
    }
    const keep = new Set();
    const positionsByIdx = new Map();
    for (const [i, m] of matches) {
        const item = items[i];
        const sep = item.sep;
        const segments = item.fullText.split(sep);
        const segStarts = [];
        let off = 0;
        for (const s of segments) {
            segStarts.push(off);
            off += s.length + sep.length;
        }
        const leafIdx = segments.length - 1;
        const leafStart = segStarts[leafIdx];
        const leafEnd = leafStart + segments[leafIdx].length;
        const leafPos = m.positions
            .filter((p) => p >= leafStart && p < leafEnd)
            .map((p) => p - leafStart);
        keep.add(i);
        positionsByIdx.set(i, leafPos);
        let neededDepth = item.depth - 1;
        for (let j = i - 1; j >= 0 && neededDepth >= 0; j--) {
            const cand = items[j];
            if (cand && cand.header && cand.depth === neededDepth) {
                if (!keep.has(j)) {
                    const segStart = segStarts[neededDepth];
                    const segEnd = segStart + segments[neededDepth].length;
                    const hdrPos = m.positions
                        .filter((p) => p >= segStart && p < segEnd)
                        .map((p) => p - segStart);
                    positionsByIdx.set(j, hdrPos);
                }
                keep.add(j);
                neededDepth--;
            }
        }
    }
    const out = [];
    for (let i = 0; i < items.length; i++) {
        if (!keep.has(i)) continue;
        out.push({ item: items[i], positions: positionsByIdx.get(i) || [] });
    }
    return out;
}

function highlight(text, positions, maxLen) {
    let truncated = false;
    let limit = text.length;
    if (typeof maxLen === 'number' && text.length > maxLen) {
        truncated = true;
        limit = Math.max(0, maxLen - 1);
    }
    const set = positions && positions.length ? new Set(positions) : null;
    let out = '';
    for (let i = 0; i < limit; i++) {
        if (set && set.has(i)) {
            out += `\x1b[33m${text[i]}\x1b[39m`; // yellow (fg-only reset preserves INVERT/BOLD)
        } else {
            out += text[i];
        }
    }
    if (truncated) out += '…';
    return out;
}

function truncatePlain(text, maxLen) {
    if (text.length <= maxLen) return text;
    return text.slice(0, Math.max(0, maxLen - 1)) + '…';
}

// Given a flat list of tests with `>`-separated full names, produce a flat
// list of header + test rows so the picker can render them as a tree.
function buildTestTree(tests) {
    const items = [];
    let prevPath = [];
    for (const test of tests) {
        const segments = test.fullName.split(' > ');
        const path = segments.slice(0, -1);
        const leaf = segments[segments.length - 1];
        let common = 0;
        while (
            common < prevPath.length &&
            common < path.length &&
            prevPath[common] === path[common]
        ) {
            common++;
        }
        for (let i = common; i < path.length; i++) {
            items.push({ header: true, depth: i, text: `${path[i]} >` });
        }
        items.push({
            test,
            depth: path.length,
            text: leaf,
            fullText: test.fullName,
            sep: ' > '
        });
        prevPath = path;
    }
    return items;
}

// Given a flat list of files (with `.display` paths), produce header + file
// rows so the picker can render them as a directory tree.
function buildFileTree(files) {
    const items = [];
    let prevPath = [];
    for (const file of files) {
        const segments = file.display.split('/');
        const dirs = segments.slice(0, -1);
        const leaf = segments[segments.length - 1];
        let common = 0;
        while (
            common < prevPath.length &&
            common < dirs.length &&
            prevPath[common] === dirs[common]
        ) {
            common++;
        }
        for (let i = common; i < dirs.length; i++) {
            items.push({ header: true, depth: i, text: `${dirs[i]}/` });
        }
        items.push({
            file,
            depth: dirs.length,
            text: leaf,
            fullText: file.display,
            sep: '/'
        });
        prevPath = dirs;
    }
    return items;
}

const CLEAR = '\x1b[2J\x1b[H';
const ENTER_ALT = '\x1b[?1049h';
const EXIT_ALT = '\x1b[?1049l';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const INVERT = '\x1b[7m';

// Lines of fixed chrome around the result list: title, hint, blank, prompt,
// blank, "… N more" (always reserved), blank, counter. Used to size the
// result list to the current terminal height.
const CHROME_LINES = 9;
const MIN_VISIBLE = 3;

/**
 * Interactive picker. Resolves to the selected item, or null if the user
 * pressed Esc (back).
 */
function pick({ title, items, getText, renderText }) {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            resolve(null);
            return;
        }

        let query = '';
        let selectedIdx = 0;
        let viewOffset = 0;

        const stdin = process.stdin;
        const stdout = process.stdout;
        if (!stdin.isTTY) {
            reject(new Error('scenario CLI requires a TTY'));
            return;
        }
        // 50ms instead of node's 500ms default makes a standalone Esc press
        // feel instant; arrow-key sequences still arrive well inside 50ms.
        readline.emitKeypressEvents(stdin, { escapeCodeTimeout: 50 });
        stdin.setRawMode(true);
        stdin.resume();
        stdout.write(ENTER_ALT);
        stdout.write(HIDE_CURSOR);

        const isHeader = (entry) => entry && entry.item && entry.item.header;

        const snapToSelectable = (rankedList, start, dir) => {
            // Move selectedIdx to the nearest non-header entry, searching first
            // in direction `dir` (+1 or -1), then the other way.
            const probe = (from, step) => {
                let i = from;
                while (i >= 0 && i < rankedList.length) {
                    if (!isHeader(rankedList[i])) return i;
                    i += step;
                }
                return -1;
            };
            const forward = probe(start, dir);
            if (forward !== -1) return forward;
            const backward = probe(start, -dir);
            return backward === -1 ? 0 : backward;
        };

        const render = () => {
            const cols = stdout.columns || 80;
            const maxVisible = Math.max(MIN_VISIBLE, (stdout.rows || 24) - CHROME_LINES);
            const ranked = filterAndRank(items, query, getText);
            if (ranked.length === 0) {
                selectedIdx = 0;
                viewOffset = 0;
            } else {
                if (selectedIdx >= ranked.length) selectedIdx = ranked.length - 1;
                if (selectedIdx < 0) selectedIdx = 0;
                if (isHeader(ranked[selectedIdx])) {
                    selectedIdx = snapToSelectable(ranked, selectedIdx, 1);
                }
                if (selectedIdx < viewOffset) viewOffset = selectedIdx;
                if (selectedIdx >= viewOffset + maxVisible)
                    viewOffset = selectedIdx - maxVisible + 1;
            }

            const hint = 'Type to filter · ↑/↓ navigate · Enter select · Esc back · Ctrl+C exit';
            let out = CLEAR;
            out += `${BOLD}${truncatePlain(title, cols)}${RESET}\n`;
            out += `${DIM}${truncatePlain(hint, cols)}${RESET}\n`;
            out += `\n> ${truncatePlain(query, Math.max(1, cols - 3))}${DIM}_${RESET}\n\n`;

            const visible = ranked.slice(viewOffset, viewOffset + maxVisible);
            if (ranked.length === 0) {
                out += `  ${DIM}(no matches)${RESET}\n`;
            }
            for (let i = 0; i < visible.length; i++) {
                const realIdx = viewOffset + i;
                const { item, positions } = visible[i];
                const depth = typeof item.depth === 'number' ? item.depth : 0;
                const indent = '  '.repeat(depth);
                // Reserve 4 cols of chrome ("  " + trailing "  " on selected).
                const maxText = Math.max(1, cols - 4 - indent.length);
                const body = highlight(renderText(item), positions, maxText);
                if (item && item.header) {
                    out += `${DIM}  ${indent}${body}${RESET}\n`;
                    continue;
                }
                if (realIdx === selectedIdx) {
                    out += `${INVERT}  ${indent}${body}  ${RESET}\n`;
                } else {
                    out += `  ${indent}${body}\n`;
                }
            }
            const hidden = ranked.length - (viewOffset + visible.length);
            if (hidden > 0) {
                out += `${DIM}  … ${hidden} more${RESET}\n`;
            }
            out += `\n${DIM}${truncatePlain(
                `${ranked.length}/${items.length} items`,
                cols
            )}${RESET}`;
            stdout.write(out);
            return ranked;
        };

        const cleanup = () => {
            stdin.setRawMode(false);
            stdin.pause();
            stdout.write(SHOW_CURSOR);
            stdout.write(EXIT_ALT);
            stdin.removeListener('keypress', onKey);
            stdout.removeListener('resize', onResize);
        };

        const onResize = () => {
            ranked = render();
        };
        stdout.on('resize', onResize);

        let ranked = render();

        const onKey = (str, key) => {
            if (!key) return;
            if (key.ctrl && key.name === 'c') {
                cleanup();
                stdout.write('\n');
                process.exit(0);
            }
            if (key.name === 'escape') {
                cleanup();
                resolve(null);
                return;
            }
            if (key.name === 'return') {
                if (ranked[selectedIdx] && !isHeader(ranked[selectedIdx])) {
                    cleanup();
                    resolve(ranked[selectedIdx].item);
                    return;
                }
                return;
            }
            if (key.name === 'up') {
                const next = snapToSelectable(ranked, selectedIdx - 1, -1);
                if (next !== -1 && next < selectedIdx) selectedIdx = next;
            } else if (key.name === 'down') {
                const next = snapToSelectable(ranked, selectedIdx + 1, 1);
                if (next !== -1 && next > selectedIdx) selectedIdx = next;
            } else if (key.name === 'backspace') {
                query = query.slice(0, -1);
                selectedIdx = 0;
                viewOffset = 0;
            } else if (str && str.length === 1 && str >= ' ' && str !== '\x7f') {
                query += str;
                selectedIdx = 0;
                viewOffset = 0;
            } else {
                return;
            }
            ranked = render();
        };
        stdin.on('keypress', onKey);
    });
}

function runGamenode(scenarioArg) {
    return new Promise((resolve) => {
        const stdout = process.stdout;
        const width = stdout.columns || 80;
        stdout.write(`${DIM}${'─'.repeat(width)}${RESET}\n`);
        stdout.write(`${BOLD}SCENARIO${RESET} ${scenarioArg}\n`);
        stdout.write(`${DIM}r reset · Esc back · Ctrl+C exit${RESET}\n`);
        stdout.write(`${DIM}${'─'.repeat(width)}${RESET}\n`);

        // Spawn node directly (not via `npm run dev:gamenode`) so that
        //  1. SIGTERM/SIGUSR2 reach the gamenode process without nodemon
        //     swallowing them, and
        //  2. nodemon doesn't auto-restart on file changes and spam the
        //     picker UI when the user comes back via Esc. The scenario
        //     runner already busts the require cache for the spec file, so
        //     the `r` hotkey gives us hot-reload-on-demand.
        const child = spawn('node', ['server/gamenode'], {
            env: { ...process.env, SCENARIO: scenarioArg, NODE_APP_INSTANCE: 'node' },
            stdio: ['ignore', 'inherit', 'inherit']
        });

        const stdin = process.stdin;
        readline.emitKeypressEvents(stdin, { escapeCodeTimeout: 50 });
        if (stdin.isTTY) stdin.setRawMode(true);
        stdin.resume();

        // Resolves once the child has actually exited. Anything that wants
        // to return control to the user (Esc back, Ctrl+C exit, child crash)
        // must wait on this — otherwise the next spawn races the dying
        // child for ports 9000/9500 and bombs with EADDRINUSE.
        let childExited = false;
        const exitPromise = new Promise((r) => {
            child.once('exit', () => {
                childExited = true;
                r();
            });
        });

        let resolved = false;
        const finish = async (back) => {
            if (resolved) return;
            resolved = true;
            if (stdin.isTTY) stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener('keypress', onKey);
            // Just SIGKILL — graceful shutdown doesn't matter in dev mode,
            // and SIGINT/SIGTERM both proved unreliable after a `r` reset
            // (the child's signal handling state gets wedged somehow).
            // Don't gate on `child.killed`: that flag flips true after any
            // signal we sent (including SIGUSR2 from `r`), even though the
            // child is still alive. Track real exit ourselves.
            if (!childExited) {
                child.kill('SIGKILL');
            }
            await exitPromise;
            resolve(back);
        };

        const onKey = (_str, key) => {
            if (!key) return;
            if (key.ctrl && key.name === 'c') {
                // Wait for the child to actually exit before terminating
                // the parent, or the child gets orphaned and keeps port 9000.
                finish(false).then(() => process.exit(0));
                return;
            }
            if (key.name === 'escape') {
                finish(true);
                return;
            }
            if (key.name === 'r' && !key.ctrl && !key.meta) {
                if (!childExited) {
                    child.kill('SIGUSR2');
                }
            }
        };
        stdin.on('keypress', onKey);

        child.on('exit', () => finish(true));
    });
}

async function main() {
    const files = collectFiles();
    if (files.length === 0) {
        console.error('No scenarios or spec files found');
        process.exit(1);
    }

    // Loop so we can go back from later screens.
    let stage = 'file';
    let selectedFile = null;
    let selectedTest = null;
    let autoSelectedTest = false;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (stage === 'file') {
            const picked = await pick({
                title: 'Pick a scenario or spec file',
                items: buildFileTree(files),
                getText: (i) => (i.header ? '' : i.fullText),
                renderText: (i) => i.text
            });
            if (!picked) {
                process.exit(0);
            }
            selectedFile = picked.file;
            stage = 'test';
            continue;
        }

        if (stage === 'test') {
            let info;
            try {
                info = inspectScenario(selectedFile.abs);
            } catch (err) {
                process.stdout.write(
                    `\n${BOLD}Failed to load ${selectedFile.rel}:${RESET}\n${err.message}\n\n`
                );
                process.stdout.write('Press any key to go back...');
                await new Promise((r) => {
                    process.stdin.setRawMode(true);
                    process.stdin.resume();
                    process.stdin.once('data', () => {
                        process.stdin.setRawMode(false);
                        process.stdin.pause();
                        r();
                    });
                });
                stage = 'file';
                continue;
            }

            if (info.tests.length === 0) {
                process.stdout.write(`\n${selectedFile.rel} has no tests.\n`);
                stage = 'file';
                continue;
            } else if (info.tests.length === 1) {
                selectedTest = info.tests[0];
                autoSelectedTest = true;
            } else {
                autoSelectedTest = false;
                const treeItems = buildTestTree(info.tests);
                const picked = await pick({
                    title: `Pick a test from ${selectedFile.rel}`,
                    items: treeItems,
                    getText: (i) => (i.header ? '' : i.fullText),
                    renderText: (i) => i.text
                });
                if (!picked) {
                    stage = 'file';
                    continue;
                }
                selectedTest = picked.test;
            }
            stage = 'run';
            continue;
        }

        if (stage === 'run') {
            const arg = `${selectedFile.rel}#${selectedTest.fullName}`;
            const back = await runGamenode(arg);
            if (back) {
                // If we only had one test, skip the test picker on back
                // (it would just auto-select and re-run the same thing).
                stage = autoSelectedTest ? 'file' : 'test';
                continue;
            }
            process.exit(0);
        }
    }
}

main().catch((err) => {
    // Restore terminal in case we crashed inside the picker.
    process.stdout.write('\x1b[?1049l\x1b[?25h');
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    console.error(err);
    process.exit(1);
});
