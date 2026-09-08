import type { Project } from '@/types'

export const engineeringProjects: Project[] = [
  {
    slug: 'atlas-freight-os',
    title: 'Atlas',
    tagline: 'An operations platform that replaced eleven spreadsheets and a WhatsApp group.',
    summary:
      'A full-stack freight operations platform for a regional logistics operator: live dispatch, driver settlements, ' +
      'customer portal and an exception queue that tells the team what is about to go wrong.',
    discipline: 'engineering',
    category: 'Full-stack platform',
    year: '2025',
    role: 'Product engineer & designer — sole technical lead',
    client: 'Atlas Freight (regional logistics operator)',
    timeline: '7 months, ongoing retainer',
    tags: ['React', 'TypeScript', 'Django REST', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'AWS'],
    featured: true,
    span: 'full',
    links: { live: 'https://example.com/atlas', repo: 'https://github.com/brianmunga/atlas-freight' },
    study: {
      overview:
        'Atlas moves roughly four hundred loads a week across three countries. When I met them, the entire operation ' +
        'ran on eleven spreadsheets, a shared inbox and a WhatsApp group with sixty-two people in it. Nobody could ' +
        'answer the two questions the business actually depended on: where is this truck, and did we make money on ' +
        'that load? I designed and built the platform that answers both — a single operational spine covering dispatch, ' +
        'tracking, driver settlements and customer visibility.',
      problem:
        'The failure was not a missing feature, it was a missing source of truth. Each spreadsheet encoded a slightly ' +
        'different version of reality, so reconciliation was a weekly two-day ritual and margin was calculated in arrears — ' +
        'often weeks after a loss-making load had already been repeated.',
      problemPoints: [
        'Load status lived in chat messages; the ops board was rebuilt by hand every morning.',
        'Driver settlements were computed manually, and disputes took an average of nine days to resolve.',
        'Customers phoned in for updates, absorbing about a third of the operations team’s day.',
        'No per-load cost model, so unprofitable lanes were invisible until the quarter closed.',
      ],
      approach:
        'I treated the load as the central aggregate and made every other surface a projection of it. One canonical state ' +
        'machine, one event log, and read models shaped for each audience: an ops board, a driver mobile view, a customer ' +
        'portal and a finance ledger. Everything else — notifications, settlements, exception detection — reacts to ' +
        'transitions rather than owning state of its own.',
      approachPoints: [
        'An explicit load state machine with guarded transitions, enforced in the database as well as the service layer.',
        'Append-only event log per load, which made the audit trail, the activity feed and the analytics warehouse the same thing.',
        'Role-scoped read models so a driver, a dispatcher and a customer literally cannot query each other’s rows.',
        'An exception queue driven by rules over live telemetry, ranked by money at risk rather than recency.',
      ],
      process: [
        {
          title: '01 — Field study, not a requirements doc',
          body:
            'Two weeks riding with dispatchers and sitting in the yard at 5am. I mapped every message type in the WhatsApp ' +
            'group into a taxonomy of eighteen operational events; that taxonomy became the schema. The most valuable ' +
            'finding was that dispatchers did not want automation — they wanted to be told sooner.',
        },
        {
          title: '02 — Domain model & state machine',
          body:
            'Modelled loads, legs, assets, drivers, rates and settlements in PostgreSQL with hard constraints: partial ' +
            'unique indexes to prevent double-assigning a truck, check constraints on transitions, and generated columns ' +
            'for margin so it could never drift from its inputs.',
        },
        {
          title: '03 — Design system before screens',
          body:
            'A 24-component library in Figma and TypeScript at the same time — density-first, because this is a tool people ' +
            'stare at for nine hours. Tabular numerals, one accent reserved exclusively for exceptions, and a keyboard ' +
            'grammar so the board is drivable without a mouse.',
        },
        {
          title: '04 — Build the spine, then the surfaces',
          body:
            'Django REST for the domain API with an OpenAPI contract generating the TypeScript client, so a schema change ' +
            'breaks the build rather than production. Celery for settlements and scheduled reconciliation; Redis pub/sub ' +
            'behind server-sent events for the live board.',
        },
        {
          title: '05 — Migration under load',
          body:
            'Ran Atlas in parallel with the spreadsheets for five weeks, with a nightly diff job that reported every ' +
            'discrepancy. Cutover happened when the diff had been empty for nine consecutive days — not when the roadmap said so.',
        },
      ],
      stack: [
        { group: 'Front end', items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'TanStack Query'] },
        { group: 'Back end', items: ['Python 3.12', 'Django 5', 'Django REST Framework', 'Celery', 'drf-spectacular'] },
        { group: 'Data', items: ['PostgreSQL 16', 'Redis', 'PostGIS', 'S3'] },
        { group: 'Platform', items: ['Docker', 'GitHub Actions', 'AWS ECS', 'CloudWatch', 'Sentry'] },
        { group: 'Auth & security', items: ['JWT with rotating refresh', 'Role-based scopes', 'Row-level tenancy', 'Audit log'] },
      ],
      architecture: {
        caption:
          'Requests hit a thin API layer; all writes go through the domain service, which is the only thing allowed to ' +
          'advance a load’s state. Everything downstream is a subscriber.',
        layers: [
          {
            label: 'Clients',
            nodes: [
              { name: 'Ops board (React)', note: 'SSE live updates' },
              { name: 'Driver PWA', note: 'Offline-first' },
              { name: 'Customer portal', note: 'Scoped tokens' },
            ],
          },
          {
            label: 'Edge',
            nodes: [
              { name: 'CloudFront + Nginx' },
              { name: 'Auth gateway', note: 'JWT / scopes', accent: true },
            ],
          },
          {
            label: 'Services',
            nodes: [
              { name: 'Domain API', note: 'Django REST', accent: true },
              { name: 'Load state machine', note: 'Guarded transitions', accent: true },
              { name: 'Settlements worker', note: 'Celery' },
              { name: 'Exception engine', note: 'Rules over telemetry' },
            ],
          },
          {
            label: 'Data',
            nodes: [
              { name: 'PostgreSQL + PostGIS', note: 'Source of truth' },
              { name: 'Event log', note: 'Append-only' },
              { name: 'Redis', note: 'Pub/sub + cache' },
              { name: 'S3', note: 'Documents, PODs' },
            ],
          },
        ],
      },
      results: [
        { label: 'Reconciliation time', value: '−94%', note: 'Two days per week to under two hours' },
        { label: 'Settlement disputes', value: '−71%', note: 'Nine days to under two, on average' },
        { label: 'Status calls absorbed', value: '3,100/mo', note: 'Handled by the customer portal' },
        { label: 'Loss-making lanes found', value: '7', note: 'In the first month of margin visibility' },
        { label: 'p95 board load', value: '340ms', note: '18k live rows, virtualised' },
        { label: 'Uptime since launch', value: '99.95%', note: 'Fourteen months' },
      ],
      resultsNarrative:
        'The headline number for the client was not a performance metric. Within a month of margin becoming visible per ' +
        'load, they renegotiated two contracts and dropped a third — a change worth more than the entire build. The ' +
        'engineering numbers matter because they are what made the operational ones believable: if the board had been slow ' +
        'or occasionally wrong, dispatchers would have kept the spreadsheet open beside it.',
      challenges: [
        {
          title: 'Offline was not an edge case',
          body:
            'Drivers spend hours outside coverage. The first driver app assumed connectivity and was quietly abandoned. ' +
            'I rebuilt it as an offline-first PWA with an IndexedDB queue and idempotency keys on every mutation, then ' +
            'made conflict resolution explicit: the server keeps a monotonic sequence per load and rejects stale ' +
            'transitions with a diff the app can show the driver.',
        },
        {
          title: 'Live boards fight with caches',
          body:
            'Optimistic updates plus server-sent events produced flicker whenever a mutation and a broadcast raced. I ' +
            'moved to a single reducer over an ordered event stream, with the mutation response treated as just another ' +
            'event. Fewer moving parts, and the board became deterministic enough to snapshot-test.',
        },
        {
          title: 'The WhatsApp group would not die',
          body:
            'Adoption stalled at about 60% because the chat was faster for ambiguous cases. Rather than fight it, I built ' +
            'a bridge: an inbound webhook that files a message against a load and asks the sender one clarifying question. ' +
            'Structured data now enters through the door people were already using.',
        },
      ],
      outcome:
        'Atlas is fourteen months into production, runs the operator’s entire dispatch and settlement flow, and has been ' +
        'extended twice by their own hires — which I count as the real result. The handover included the design system, ' +
        'an architecture decision record for every significant choice, and a runbook that has so far survived two people leaving.',
      next: [
        'Predictive ETA using the two years of telemetry now accumulated in the event log.',
        'A lane-pricing model to move quoting from experience to evidence.',
      ],
      gallery: [
        { caption: 'Dispatch board — density-first, keyboard-drivable, exceptions ranked by money at risk.', ratio: '16 / 10' },
        { caption: 'Settlement statement, generated per driver per fortnight with a full audit trail.', ratio: '4 / 3' },
        { caption: 'Customer portal — one link per load, no login required, scoped read token.', ratio: '4 / 3' },
      ],
    },
  },

  {
    slug: 'ledger-lens',
    title: 'Ledger Lens',
    tagline: 'Reconciliation for finance teams, with an anomaly model that explains itself.',
    summary:
      'A reconciliation service that ingests statements from nine banks and mobile-money providers, matches them against ' +
      'an internal ledger, and surfaces the exceptions worth a human’s attention — with a reason attached.',
    discipline: 'engineering',
    category: 'Fintech service · applied ML',
    year: '2025',
    role: 'Lead engineer — API, matching engine, review interface',
    client: 'Fintech operations team (14 analysts)',
    timeline: '5 months',
    tags: ['FastAPI', 'Python', 'PostgreSQL', 'React', 'TypeScript', 'Scikit-learn', 'Docker'],
    featured: true,
    span: 'wide',
    links: { repo: 'https://github.com/brianmunga/ledger-lens' },
    study: {
      overview:
        'Fourteen analysts were reconciling about 90,000 transactions a month by eye, across nine providers with nine ' +
        'different notions of what a statement looks like. Ledger Lens turns that into a queue: everything that matches ' +
        'cleanly disappears, and what remains arrives with a candidate match, a confidence, and a stated reason.',
      problem:
        'Naive matching on amount and date resolved barely half the volume. The rest failed on the human details — fees ' +
        'netted off, batched settlements, reference numbers truncated differently by each provider, timestamps in three ' +
        'timezones. Every unmatched line became a manual investigation, and the backlog closed the books four days late every month.',
      problemPoints: [
        'Nine ingest formats, two of which were PDF statements with no machine-readable variant.',
        'One-to-many and many-to-many settlements that exact matching cannot represent at all.',
        'No shared vocabulary for *why* something did not match, so analyst knowledge stayed tacit.',
        'Audit requirements meant every automated decision had to be reconstructable a year later.',
      ],
      approach:
        'A three-stage pipeline: normalise, then match deterministically, then score what is left. Deterministic rules ' +
        'handle the 71% they can handle and are trivially auditable. Only the residue reaches a gradient-boosted ' +
        'classifier over engineered similarity features, and its output is a *ranked suggestion for a human*, never an ' +
        'automatic posting. Every decision writes an immutable record of its inputs and model version.',
      approachPoints: [
        'A canonical transaction schema with provider adapters — new providers ship as an adapter plus fixtures, not a code change.',
        'Blocking on amount buckets and date windows so candidate generation stays sub-linear at volume.',
        'Similarity features: amount delta, fee-adjusted delta, token-set ratio on references, timezone-corrected time gap, provider priors.',
        'A review interface built for one keystroke per decision, whose accept/reject stream is the training set for the next model.',
      ],
      process: [
        {
          title: '01 — Shadowing the analysts',
          body:
            'I sat with four analysts and recorded the reasoning behind 300 manual matches. That transcript produced the ' +
            'feature list — including the one feature that mattered most, a provider-specific fee pattern nobody had written down.',
        },
        {
          title: '02 — Normalisation layer',
          body:
            'Pydantic models per provider, a canonical internal representation, and golden-file tests for every format. ' +
            'PDF statements go through a table extractor with a confidence threshold; below it, the file is quarantined rather than guessed at.',
        },
        {
          title: '03 — Deterministic core first',
          body:
            'Before any model, I implemented the rules the analysts could state out loud. That set the baseline at 71% ' +
            'auto-match and, more importantly, defined what the model was allowed to touch.',
        },
        {
          title: '04 — Scoring the residue',
          body:
            'LightGBM over 14 similarity features, calibrated with isotonic regression so the confidence is a probability ' +
            'and not a vibe. Thresholds are configurable per provider; above the high threshold a match is pre-selected, ' +
            'below the low threshold it is not shown at all.',
        },
        {
          title: '05 — Review UX as data collection',
          body:
            'The queue is keyboard-first: J/K to move, Enter to accept, R with a reason code to reject. Reason codes were ' +
            'the quiet win — they gave the team a shared vocabulary and gave me labelled negatives.',
        },
      ],
      stack: [
        { group: 'API', items: ['FastAPI', 'Pydantic v2', 'SQLAlchemy 2', 'Alembic', 'Uvicorn'] },
        { group: 'Matching', items: ['Pandas', 'RapidFuzz', 'LightGBM', 'Scikit-learn', 'MLflow'] },
        { group: 'Front end', items: ['React', 'TypeScript', 'TanStack Table', 'Tailwind CSS'] },
        { group: 'Data', items: ['PostgreSQL', 'Immutable decision log', 'S3 statement archive'] },
        { group: 'Platform', items: ['Docker Compose', 'GitHub Actions', 'Railway', 'OpenTelemetry'] },
      ],
      architecture: {
        caption:
          'The model sits deliberately downstream of deterministic matching and upstream of a human. It never writes to the ledger.',
        layers: [
          {
            label: 'Ingest',
            nodes: [
              { name: 'Provider adapters', note: '9 formats' },
              { name: 'PDF extractor', note: 'Confidence-gated' },
              { name: 'Quarantine', note: 'Human triage' },
            ],
          },
          {
            label: 'Pipeline',
            nodes: [
              { name: 'Normaliser', note: 'Canonical schema' },
              { name: 'Deterministic matcher', note: '71% resolved', accent: true },
              { name: 'Candidate blocking', note: 'Amount × date' },
              { name: 'LightGBM scorer', note: 'Calibrated', accent: true },
            ],
          },
          {
            label: 'Human layer',
            nodes: [
              { name: 'Review queue', note: 'Keyboard-first', accent: true },
              { name: 'Reason codes', note: 'Shared vocabulary' },
            ],
          },
          {
            label: 'System of record',
            nodes: [
              { name: 'Ledger (Postgres)' },
              { name: 'Decision log', note: 'Immutable, versioned' },
              { name: 'Model registry', note: 'MLflow' },
            ],
          },
        ],
      },
      results: [
        { label: 'Auto-matched', value: '94.2%', note: 'From 71% deterministic-only' },
        { label: 'False accepts', value: '0.11%', note: 'At the configured high threshold' },
        { label: 'Month-end close', value: '4 days earlier', note: 'Backlog cleared before cut-off' },
        { label: 'Analyst time reclaimed', value: '~310 hrs/mo', note: 'Redeployed to exception investigation' },
        { label: 'Ingest throughput', value: '90k txns', note: 'Per month, 9 providers' },
      ],
      resultsNarrative:
        'The interesting jump was not 71% to 94%. It was that the remaining 5.8% became a defined, ranked, explainable ' +
        'queue instead of an undifferentiated backlog — which is what let the team close the books early. Calibration ' +
        'earned the trust: because the confidence number meant what it said, the finance lead was willing to set a threshold at all.',
      challenges: [
        {
          title: 'A model in a regulated path',
          body:
            'Audit does not accept "the model decided". I made the model advisory by construction — it ranks, a human ' +
            'commits — and every posting carries the model version, feature vector and threshold in an immutable log. ' +
            'Reconstructing why a match was suggested in March is a single query.',
        },
        {
          title: 'Drift with no ground truth',
          body:
            'When a provider changed its reference format, precision degraded before anyone noticed. I added a weekly ' +
            'population-stability check on feature distributions plus a mandatory 2% random sample of auto-matches routed ' +
            'to human review. The sample is the only honest measurement of the automatic path, so it stays even though it costs time.',
        },
        {
          title: 'Many-to-many settlements',
          body:
            'Pairwise scoring cannot express "these three debits and this fee equal that settlement". I added a bounded ' +
            'subset-sum search within each block, capped by candidate count and time budget, and surfaced it as a distinct ' +
            'group-match type in the interface. It recovers about 4% of volume that no pairwise model could reach.',
        },
      ],
      outcome:
        'Ledger Lens has been running for eleven months. Two providers have been added by the client’s own team using the ' +
        'adapter interface and the fixture suite — the closest thing to proof that the seams were drawn in the right places.',
      next: [
        'Active learning: route the samples the model is least certain about to review first.',
        'Provider-level anomaly alerting on fee patterns, which the feature work already exposes.',
      ],
      gallery: [
        { caption: 'Review queue — candidate match, calibrated confidence, and the reason it was suggested.', ratio: '16 / 10' },
        { caption: 'Provider health view: ingest volume, extraction confidence, drift indicators.', ratio: '4 / 3' },
      ],
    },
  },

  {
    slug: 'meridian-design-system',
    title: 'Meridian',
    tagline: 'A design system and component library shared by four product teams.',
    summary:
      'An open-source, accessibility-first React and TypeScript component library with a token pipeline that generates ' +
      'CSS variables, Tailwind theme output and Figma variables from one source.',
    discipline: 'engineering',
    category: 'Design system · open source',
    year: '2024',
    role: 'Creator & maintainer',
    timeline: '9 months, actively maintained',
    tags: ['TypeScript', 'React', 'Radix UI', 'Tailwind CSS', 'Vitest', 'Storybook', 'Changesets'],
    span: 'half',
    links: { live: 'https://example.com/meridian', repo: 'https://github.com/brianmunga/meridian' },
    study: {
      overview:
        'Four product teams, four button components, three of them subtly inaccessible. Meridian is the library that ' +
        'replaced them: 38 components, one token pipeline, and a contract that makes the accessible path the easiest path.',
      problem:
        'The visible cost was duplication. The real cost was that every team re-litigated focus management, keyboard ' +
        'behaviour and colour contrast — and lost, quietly, in different ways. An audit found 61 WCAG violations across ' +
        'the four apps, most of them the same six mistakes repeated.',
      problemPoints: [
        'Design tokens existed in Figma and in code, and had drifted about 30% apart.',
        'Every team had written its own modal; none of them trapped focus correctly.',
        'No shared testing story for interaction, so regressions shipped silently.',
        'Upgrades were unattributable — nobody knew which app used which version of what.',
      ],
      approach:
        'Behaviour comes from Radix primitives, so I am not re-implementing a combobox’s keyboard model. Appearance comes ' +
        'from tokens, generated from one JSON source into CSS custom properties, a Tailwind theme and Figma variables. ' +
        'The library ships types that make invalid states unrepresentable — an icon-only button cannot compile without an accessible label.',
      approachPoints: [
        'Token pipeline: one source → CSS variables, Tailwind theme, Figma variables, documentation table.',
        'Compound components with a strict prop contract; polymorphic `as` handled through a typed slot rather than `any`.',
        'Every component ships an axe test, a keyboard-interaction test and a visual snapshot.',
        'Changesets-driven releases with a codemod for each breaking change.',
      ],
      process: [
        {
          title: '01 — Audit and inventory',
          body:
            'Catalogued 214 component instances across four codebases and reduced them to 38 real components. Twelve ' +
            'candidates were rejected outright as one-off layouts that did not deserve an abstraction.',
        },
        {
          title: '02 — Tokens as the contract',
          body:
            'Three-tier tokens — primitive, semantic, component — so a product can retheme by overriding semantics without ' +
            'forking components. Dark mode is a selected set of steps at the semantic layer, not an inversion.',
        },
        {
          title: '03 — Behaviour on primitives',
          body:
            'Radix for dialog, popover, select, tooltip, tabs. This decision removed the entire category of focus-management ' +
            'bugs that caused most of the audit findings.',
        },
        {
          title: '04 — Testing the interaction, not the markup',
          body:
            'Vitest with Testing Library, driven by keyboard and pointer semantics; axe on every story; Playwright snapshots ' +
            'in both themes. CI blocks a merge on a contrast regression the same way it blocks a type error.',
        },
        {
          title: '05 — Migration with codemods',
          body:
            'Each breaking change ships with a jscodeshift transform and a changelog entry that says what it rewrites. ' +
            'Adoption went from voluntary to routine once upgrades stopped costing an afternoon.',
        },
      ],
      stack: [
        { group: 'Library', items: ['React 19', 'TypeScript (strict)', 'Radix UI', 'Tailwind CSS v4', 'CVA'] },
        { group: 'Tokens', items: ['JSON source of truth', 'Style Dictionary', 'CSS custom properties', 'Figma variables API'] },
        { group: 'Quality', items: ['Vitest', 'Testing Library', 'axe-core', 'Playwright', 'Storybook 8'] },
        { group: 'Release', items: ['Changesets', 'GitHub Actions', 'npm provenance', 'jscodeshift codemods'] },
      ],
      results: [
        { label: 'Components', value: '38', note: 'Down from 214 instances' },
        { label: 'WCAG violations', value: '61 → 0', note: 'Across the four consuming apps' },
        { label: 'Bundle, tree-shaken', value: '31kB', note: 'Gzipped, typical app slice' },
        { label: 'Test coverage', value: '96%', note: 'Statements, with interaction tests' },
        { label: 'Time to new screen', value: '−58%', note: 'Measured across nine features' },
      ],
      resultsNarrative:
        'The measurable win is velocity, but the durable win is that accessibility stopped being a phase. It is now a ' +
        'property of the components, enforced in CI, and no product team has to remember it.',
      challenges: [
        {
          title: 'Flexible enough to use, strict enough to trust',
          body:
            'The first version accepted a `className` everywhere and was immediately used to defeat the system. I replaced ' +
            'it with explicit variant props plus a small set of documented style slots. Escape hatches still exist, but ' +
            'they are named, typed and visible in review.',
        },
        {
          title: 'Keeping Figma and code honest',
          body:
            'Manual sync failed within a month. The pipeline now pushes to the Figma variables API in CI, and a scheduled ' +
            'job diffs published variables against the token source and opens an issue on drift.',
        },
      ],
      outcome:
        'Meridian backs four production applications and has outside contributors. Two of the accessibility patterns it ' +
        'encodes were adopted by a team I have never worked with, which is the point of publishing it.',
      gallery: [
        { caption: 'Token documentation, generated from the same source that generates the CSS.', ratio: '4 / 3' },
        { caption: 'Storybook: every component in both themes, with axe results inline.', ratio: '16 / 10' },
      ],
    },
  },
]
