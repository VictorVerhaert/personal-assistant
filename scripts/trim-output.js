// postToolUse hook: trims oversized shell/search/fetch output before the model sees it.
// Fail-open: any error or no-op prints nothing, so the original result is kept.
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const MIN_CHARS = 8000;
const HEAD = 60;
const TAIL = 40;
const MAX_LINE = 500;
const MAX_ERRORS = 12;
const KEEP_SPILLS = 40;
const TOOLS = new Set(['powershell', 'bash', 'read_powershell', 'read_bash', 'grep', 'glob', 'rg', 'web_fetch']);
const SPILL_RE = /^\d+-\d+-[0-9a-f]{8}-[\w-]+\.txt$/;
const ERROR_RE = /\b(error|exception|fail(ed|ure)?|fatal|traceback|panic)\b/i;

function spill(text, toolName) {
  const dir = path.join(os.tmpdir(), `pa-tool-output-${os.userInfo().username}`);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const st = fs.lstatSync(dir);
  if (!st.isDirectory() || (process.getuid && (st.uid !== process.getuid() || st.mode & 0o077))) throw new Error('unsafe spill dir');
  const name = `${Date.now()}-${process.pid}-${crypto.randomBytes(4).toString('hex')}-${toolName}.txt`;
  const file = path.join(dir, name);
  fs.writeFileSync(file, text, { flag: 'wx', mode: 0o600 });
  fs.readdirSync(dir)
    .filter((f) => SPILL_RE.test(f))
    .sort()
    .slice(0, -KEEP_SPILLS)
    .forEach((f) => {
      const p = path.join(dir, f);
      if (fs.lstatSync(p).isFile()) fs.rmSync(p, { force: true });
    });
  return file;
}

function trim(text, toolName) {
  const clean = text.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');
  if (clean.length < MIN_CHARS) return null;

  const file = spill(text, toolName);
  const note = `[trimmed ${clean.length} chars; full output: ${file} — grep it, do not re-run]`;
  const lines = clean.split('\n');
  if (lines.length <= HEAD + TAIL) {
    return `${clean.slice(0, 4000)}\n${note}\n${clean.slice(-4000)}`;
  }
  const cap = (l) => (l.length > MAX_LINE ? `${l.slice(0, MAX_LINE)}…` : l);
  const errors = lines
    .slice(HEAD, -TAIL)
    .filter((l) => ERROR_RE.test(l))
    .slice(0, MAX_ERRORS)
    .map((l) => l.slice(0, 300));
  return [
    ...lines.slice(0, HEAD).map(cap),
    note,
    ...(errors.length ? ['[error lines from trimmed middle]', ...errors] : []),
    ...lines.slice(-TAIL).map(cap),
  ].join('\n');
}

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  try {
    const { toolName, toolResult } = JSON.parse(input);
    const text = toolResult && toolResult.textResultForLlm;
    if (!TOOLS.has(toolName) || typeof text !== 'string') return;
    const trimmed = trim(text, toolName);
    if (trimmed === null || trimmed.length >= text.length) return;
    process.stdout.write(JSON.stringify({ modifiedResult: { ...toolResult, textResultForLlm: trimmed } }));
  } catch {
    // fail-open
  }
});
