// verify-provider.mjs — functional smoke test for the mattpocock-skills-dsh-zh
// skill provider, without booting a DSH profile.
import { apply } from '../lib/index.js'

let captured
const ctx = {
  skills: {
    registerProvider(providerFactory) {
      captured = providerFactory({})
    }
  }
}

apply(ctx)
if (!captured) {
  console.error('FAIL: provider was not registered')
  process.exit(1)
}

const candidates = await captured.list({ signal: undefined })
console.log(`discovered ${candidates.length} candidate(s):`)
const expected = new Set([
  'ask-matt-zh', 'code-review-zh', 'codebase-design-zh', 'diagnosing-bugs-zh', 'domain-modeling-zh',
  'grill-me-zh', 'grill-with-docs-zh', 'grilling-zh', 'handoff-zh', 'implement-zh',
  'improve-codebase-architecture-zh', 'prototype-zh', 'research-zh', 'resolving-merge-conflicts-zh',
  'setup-matt-pocock-skills-zh', 'tdd-zh', 'teach-zh', 'to-questionnaire-zh', 'to-spec-zh', 'to-tickets-zh',
  'triage-zh', 'wait-what-zh', 'wayfinder-zh', 'wizard-zh', 'writing-for-agents-zh'
])
const found = new Set()
let failures = 0

for (const c of candidates) {
  found.add(c.name)
  const detail = await captured.get(c, { signal: undefined })
  const flag = detail?.invocation?.modelInvocable === false ? 'user-only' : 'model+user'
  console.log(
    `  - ${c.name}: "${detail?.description?.slice(0, 60) ?? 'MISSING'}..." [${flag}] content=${detail?.content?.length ?? 0} chars`
  )
  if (!detail?.content || !detail?.resourceBase) failures++
  const d = detail?.description ?? ''
  if (!/[一-鿿]/.test(d)) {
    console.error(`FAIL: ${c.name} description does not look Chinese: "${d}"`)
    failures++
  }
  if (d.startsWith('>')) {
    console.error(`FAIL: ${c.name} description not folded: "${d}"`)
    failures++
  }
}

for (const want of expected) {
  if (!found.has(want)) {
    console.error(`FAIL: expected skill "${want}" was not discovered`)
    failures++
  }
}
for (const name of found) {
  if (!expected.has(name)) {
    console.error(`FAIL: unexpected skill "${name}" discovered`)
    failures++
  }
}

if (failures) {
  console.error(`FAIL: ${failures} problem(s)`)
  process.exit(1)
}
console.log('OK: all 25 zh skills discovered, Chinese descriptions, folded YAML parsed, get() passes')
