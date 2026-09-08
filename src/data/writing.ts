import type { Article } from '@/types'

export const articles: Article[] = [
  {
    slug: 'who-verifies-the-verifier',
    title: 'Who Verifies the Verifier?',
    dek: 'Every system eventually reaches a question it cannot answer about itself.',
    category: 'AI',
    date: '2026-09-03',
    // 371 words — short and dense rather than long.
    readingTime: 2,
    tags: ['Alignment', 'Foundations', 'Epistemics'],
    featured: true,
    body: [
      {
        type: 'lead',
        text:
          'Consider the set of all sets that do not contain themselves. Does it contain itself? If yes, it ' +
          'shouldn’t. If no, it should.',
      },
      {
        type: 'p',
        text:
          'Bertrand Russell wrote this down in 1901 and the foundations of mathematics collapsed under it. The ' +
          'system had generated a contradiction from within itself. Self-reference, taken seriously, produces ' +
          'contradiction.',
      },
      {
        type: 'p',
        text:
          'Mathematics didn’t stop. It rebuilt. Carefully, with explicit rules about what a system is permitted ' +
          'to say about itself.',
      },
      { type: 'quote', text: 'It is difficult not to see the parallel with AI alignment.' },
      {
        type: 'p',
        text:
          'The values embedded in a model were placed there by a group of people, operating within a set of ' +
          'assumptions, inside a particular cultural and institutional moment. Before the system ever speaks, ' +
          'the ground beneath it has already been chosen. When the model reasons about whether it is aligned, it ' +
          'does so using the same substrate those values live in.',
      },
      {
        type: 'p',
        text:
          '30 years later, Gödel found something else. Fix the foundations and another limit appears. Any ' +
          'sufficiently powerful formal system contains true statements it cannot prove from within itself. The ' +
          'system can be coherent. It cannot be total. Russell found contradiction. Gödel found limitation.',
      },
      { type: 'quote', text: 'Who defines the foundations in the first place matters.' },
      {
        type: 'p',
        text:
          'Current alignment reflects a particular set of values. Some broadly shared. Many not. They carry the ' +
          'assumptions of the institutions, languages, and cultural moments closest to the technology. And these ' +
          'foundations, once load-bearing, resist revision. Everything constructed on top inherits their ' +
          'assumptions. The error propagates forward invisibly, through every system that touches what was ' +
          'decided early.',
      },
      {
        type: 'p',
        text:
          'Foundations have a strange property. The deeper they sit, the less visible they become. By the time ' +
          'everyone is standing on them, they stop looking like decisions at all. Interestingly, the most ' +
          'consequential assumptions are usually the ones that stop looking like assumptions.',
      },
      {
        type: 'p',
        text:
          'The question of legitimate authority here has no clean answer. A narrow group is insufficient. A ' +
          'broader democratic process surfaces values in genuine tension with no stable resolution on questions ' +
          'this abstract. Even a theoretical global majority cannot fully step outside itself when deciding what ' +
          'human values should become.',
      },
      {
        type: 'p',
        text:
          'The foundations are being laid now, inch by inch. Many will disappear from view. Who is in the room ' +
          'matters as much as the assumptions they no longer notice.',
      },
    ],
  },

  {
    slug: 'uncertainty-is-an-interface-problem',
    title: 'A model’s uncertainty becomes someone else’s problem at the interface',
    dek:
      'Every probabilistic system eventually meets a person who has to act. Most of the damage happens in the two ' +
      'centimetres between the score and the button.',
    category: 'AI',
    date: '2026-07-18',
    readingTime: 9,
    tags: ['AI', 'Product design', 'Evaluation'],
    featured: true,
    body: [
      {
        type: 'lead',
        text:
          'We spend months calibrating a model and then render its output as a green tick. The uncertainty did not go ' +
          'anywhere — it was transferred, silently, to whoever clicks the button.',
      },
      {
        type: 'p',
        text:
          'I have built three systems now where a model’s output leads directly to a human decision: a reconciliation ' +
          'queue, a lending threshold, and a research assistant over an archive. In all three, the modelling was the ' +
          'tractable half. The hard half was deciding what the interface should say when the model is 0.62 confident.',
      },
      { type: 'h2', text: 'Three states, not two' },
      {
        type: 'p',
        text:
          'The default design has two states: an answer, and an error. Probabilistic systems need at least three — ' +
          'answered, partial, and declined — and the third one is where trust is actually built. When Corpus started ' +
          'saying “the archive does not support an answer to this”, usage went up, not down. People had been ' +
          'spot-checking it because they could not tell the difference between a confident answer and a fabricated one.',
      },
      {
        type: 'quote',
        text:
          'A system that never refuses is not confident. It is unable to tell you when it does not know, which is a ' +
          'different and much worse property.',
      },
      { type: 'h2', text: 'Calibration is a design deliverable' },
      {
        type: 'p',
        text:
          'A confidence score is only usable in an interface if it means something. Uncalibrated model outputs cluster ' +
          'near 0 and 1 regardless of actual reliability, which makes any threshold arbitrary. Isotonic regression on a ' +
          'holdout is twenty lines of code, and it is the difference between a number a finance lead will set a policy ' +
          'against and a number they will ignore.',
      },
      {
        type: 'list',
        items: [
          'If a score is shown to a user, calibrate it or do not show it.',
          'Name the operating threshold in the interface, not just in the config.',
          'Show the evidence beside the conclusion — always, not on request.',
          'Make the refusal state a designed state, with its own layout and its own copy.',
        ],
      },
      { type: 'h2', text: 'The automation-bias tax' },
      {
        type: 'p',
        text:
          'Ranked queues create their own problem: people stop evaluating and start confirming. In Ledger Lens we ' +
          'measured it — reviewers accepted the top suggestion at a rate slightly above the model’s own precision, which ' +
          'means they were agreeing with it more often than it deserved. The mitigation was structural, not educational: ' +
          'a mandatory random sample of auto-matched items routed back to human review, permanently.',
      },
      {
        type: 'note',
        text:
          'A random sample of the automatic path is the only honest measurement you will ever have of it. It costs time ' +
          'forever, and it is the first thing anyone tries to cut.',
      },
      {
        type: 'p',
        text:
          'None of this is exotic. It is mostly the discipline of treating the last two centimetres — score to button — ' +
          'as part of the system, and evaluating it as rigorously as the part that has a loss function.',
      },
    ],
  },

  {
    slug: 'accuracy-is-the-wrong-number',
    title: 'Accuracy is the wrong number',
    dek:
      'At a 7% base rate, a model that predicts “nothing will happen” is 93% accurate and worth nothing. How to talk ' +
      'about performance with people who are not going to read a confusion matrix.',
    category: 'Data Science',
    date: '2026-05-02',
    readingTime: 7,
    tags: ['Evaluation', 'Statistics', 'Communication'],
    featured: true,
    body: [
      {
        type: 'lead',
        text:
          'The most useful hour I have ever spent with a stakeholder was building a deliberately useless model in front ' +
          'of them and watching it score 93%.',
      },
      {
        type: 'p',
        text:
          'Churn was running at about 7% a quarter. I wrote three lines that predicted “stays” for every account, put its ' +
          'accuracy on the screen, and asked the growth lead whether they would like to ship it. That demonstration did ' +
          'more than any amount of explanation about precision and recall.',
      },
      { type: 'h2', text: 'Lead with the chart that maps to the decision' },
      {
        type: 'p',
        text:
          'Their decision was not “is this account going to churn”. It was “who do we put in this month’s campaign”. That ' +
          'is a ranking problem, so the honest chart is a cumulative lift curve: if you contact the top three deciles, ' +
          'what share of the people who would have left do you reach?',
      },
      {
        type: 'chart',
        chart: {
          kind: 'line',
          title: 'Three deciles reach seventy percent of churners',
          subtitle: 'Cumulative share of churners captured, by score decile',
          xLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          yUnit: '%',
          source: 'Time-based holdout, n = 24,180 accounts',
          series: [
            {
              name: 'Model',
              unit: '%',
              points: [
                { x: 0, y: 34 },
                { x: 1, y: 56 },
                { x: 2, y: 70 },
                { x: 3, y: 79 },
                { x: 4, y: 86 },
                { x: 5, y: 91 },
                { x: 6, y: 95 },
                { x: 7, y: 97.5 },
                { x: 8, y: 99 },
                { x: 9, y: 100 },
              ],
            },
            {
              name: 'Random',
              unit: '%',
              points: [
                { x: 0, y: 10 },
                { x: 1, y: 20 },
                { x: 2, y: 30 },
                { x: 3, y: 40 },
                { x: 4, y: 50 },
                { x: 5, y: 60 },
                { x: 6, y: 70 },
                { x: 7, y: 80 },
                { x: 8, y: 90 },
                { x: 9, y: 100 },
              ],
            },
          ],
        },
      },
      {
        type: 'p',
        text:
          'Nobody needed to be taught to read that. The diagonal is what you get by guessing; the distance above it is ' +
          'what the model is worth. The conversation moved immediately to audience size and budget, which is where it ' +
          'should have started.',
      },
      { type: 'h2', text: 'A baseline is not optional' },
      {
        type: 'p',
        text:
          'Every model I ship carries a named baseline: the majority class, the historical mean, or the hand-written rule ' +
          'it replaces. Reporting a metric without one is not a result, it is a number. In Kilimo Yield the baseline was ' +
          'the per-zone historical average, and “38% better than what you do now” landed in a way that “MAE 0.21” never would.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'State the base rate before any metric.',
          'Name the baseline the model must beat, and beat it visibly.',
          'Choose the metric that maps to the action: ranking → lift, thresholds → precision at that threshold, forecasts → interval coverage.',
          'Report the failure mode as prominently as the headline. Zone-holdout error doubled in my last project; that sentence is in the first paragraph of the report.',
        ],
      },
      {
        type: 'quote',
        text: 'If the metric you report would not change if the model got worse in the way it is most likely to get worse, it is the wrong metric.',
      },
    ],
  },

  {
    slug: 'design-tokens-are-an-api',
    title: 'Design tokens are an API, so version them like one',
    dek:
      'A colour that four teams depend on is not a design decision any more. It is a public interface with consumers, ' +
      'breaking changes and a migration path.',
    category: 'Design',
    date: '2026-03-11',
    readingTime: 8,
    tags: ['Design systems', 'Tokens', 'TypeScript'],
    body: [
      {
        type: 'lead',
        text:
          'Meridian’s tokens broke four applications exactly once. After that I started treating the token file the way ' +
          'I treat a published package, because that is what it is.',
      },
      {
        type: 'p',
        text:
          'The failure was innocuous: renaming `surface-raised` to `surface-2` for consistency. It was correct, it was ' +
          'better, and it shipped as a patch release. Three apps went grey.',
      },
      { type: 'h2', text: 'Three tiers, one direction of dependency' },
      {
        type: 'p',
        text:
          'Primitive tokens are values — `blue-500`. Semantic tokens are intent — `surface`, `ink-muted`, `accent`. ' +
          'Component tokens are local — `button-bg-hover`. Products consume semantics and components only. Nothing in a ' +
          'product may reference a primitive, because a primitive has no promise attached to it.',
      },
      {
        type: 'code',
        lang: 'json',
        caption: 'One source of truth; the CSS, the Tailwind theme and the Figma variables are all generated from it.',
        code: `{
  "color": {
    "primitive": { "vermilion": { "600": "#c9350f", "500": "#ff5a2e" } },
    "semantic": {
      "accent":     { "light": "{color.primitive.vermilion.600}",
                      "dark":  "{color.primitive.vermilion.500}" },
      "ink-muted":  { "light": "#6b6862", "dark": "#9a968d" }
    }
  }
}`,
      },
      {
        type: 'p',
        text:
          'Note that dark mode is a *selected* value at the semantic layer, not a computed inversion of the light one. ' +
          'Every automatic dark theme I have shipped has produced at least one unreadable pair; picking the steps takes an ' +
          'afternoon and never comes back.',
      },
      { type: 'h2', text: 'Deprecate, do not rename' },
      {
        type: 'list',
        items: [
          'A rename ships as an alias plus a deprecation warning, never as a replacement.',
          'Every breaking change ships with a codemod. If it cannot be codemodded, it is not ready.',
          'Contrast is a CI check. A token pair that drops below its required ratio fails the build like a type error.',
          'The documentation table is generated from the token source, so it cannot drift.',
        ],
      },
      {
        type: 'note',
        text:
          'The Figma side matters as much: variables are pushed from the same source in CI, and a scheduled job diffs ' +
          'published variables against it and opens an issue on drift. Manual sync survived one month.',
      },
      {
        type: 'p',
        text:
          'None of this makes design slower. It makes the fifth change as cheap as the first, which is the only ' +
          'definition of a system that means anything.',
      },
    ],
  },

  {
    slug: 'eleven-spreadsheets',
    title: 'What eleven spreadsheets taught me about domain modelling',
    dek:
      'A spreadsheet is a domain model with no constraints and eleven authors. Reading them properly was the most ' +
      'valuable design research I have done.',
    category: 'Engineering',
    date: '2026-01-24',
    readingTime: 10,
    tags: ['Architecture', 'PostgreSQL', 'Django'],
    body: [
      {
        type: 'lead',
        text:
          'Before I wrote a line of Atlas, I printed all eleven spreadsheets. The columns people had added by hand were ' +
          'the requirements document — better than any workshop would have produced, because they were paid for in pain.',
      },
      {
        type: 'p',
        text:
          'A column named `actually delivered?` next to a column named `delivered` tells you something a stakeholder ' +
          'interview never will: the state machine in the software did not match the state machine in the world.',
      },
      { type: 'h2', text: 'Put the invariants in the database' },
      {
        type: 'p',
        text:
          'Application-layer validation is a suggestion. It is bypassed by a management command, a data fix, a second ' +
          'service, or a colleague in a hurry. If a truck cannot be on two loads at once, that is a partial unique index, ' +
          'not an `if` statement.',
      },
      {
        type: 'code',
        lang: 'sql',
        caption: 'The constraint that ended a category of double-booking bug.',
        code: `-- A vehicle may hold at most one active assignment.
CREATE UNIQUE INDEX one_active_assignment_per_vehicle
  ON load_assignments (vehicle_id)
  WHERE status IN ('dispatched', 'in_transit');

-- Margin can never drift from its inputs.
ALTER TABLE loads
  ADD COLUMN margin_cents bigint
  GENERATED ALWAYS AS (revenue_cents - cost_cents) STORED;`,
      },
      { type: 'h2', text: 'The event log pays for itself three times' },
      {
        type: 'p',
        text:
          'I added an append-only event log per load for the audit trail. It turned out to also be the activity feed, the ' +
          'analytics source, and — two years later — the training data for an ETA model nobody had planned. One table, ' +
          'three unplanned uses, because it recorded transitions rather than overwriting state.',
      },
      {
        type: 'quote',
        text: 'Store what happened. State is a projection of history, and it is the projection that keeps changing its mind.',
      },
      { type: 'h2', text: 'Migrate against a diff, not a date' },
      {
        type: 'p',
        text:
          'We ran Atlas in parallel with the spreadsheets for five weeks with a nightly job that diffed every field and ' +
          'reported discrepancies. Cutover happened when the diff had been empty for nine consecutive days. The diff ' +
          'found sixteen real bugs, four of which were in the spreadsheets.',
      },
      {
        type: 'list',
        items: [
          'Read the artefacts people made to survive the old system; the hand-added columns are your schema.',
          'Encode invariants where they cannot be bypassed.',
          'Log transitions, project state.',
          'Let a diff, not a deadline, decide when the migration is done.',
        ],
      },
    ],
  },

  {
    slug: 'retrieval-is-the-model',
    title: 'Retrieval is the model',
    dek:
      'Two thirds of the accuracy gain in my last RAG system came before the prompt. Most “generation problems” are ' +
      'retrieval problems in a costume.',
    category: 'AI',
    date: '2025-11-09',
    readingTime: 8,
    tags: ['RAG', 'Retrieval', 'Evaluation'],
    body: [
      {
        type: 'lead',
        text:
          'The standard recipe — chunk at 512 tokens, embed, take the top five, prompt — is a baseline, not a system. ' +
          'It got me 58% on the evaluation set. Fixing retrieval, and nothing else, got me to 74%.',
      },
      { type: 'h2', text: 'Fixed-size chunking destroys the citable parts' },
      {
        type: 'p',
        text:
          'Definitions, tables and clause lists are exactly what people cite, and exactly what a 512-token window cuts in ' +
          'half. Chunking on document structure — headings, list boundaries, table integrity — with a parent-child index ' +
          'back to the containing section, was worth more than any embedding-model upgrade I tried.',
      },
      { type: 'h2', text: 'Embeddings cannot find “Section 14(b)”' },
      {
        type: 'p',
        text:
          'About 18% of the real questions researchers asked contained an identifier: a statute number, a programme code, ' +
          'a proper noun. Dense retrieval treats these as low-information tokens and reliably fails. BM25 finds them ' +
          'instantly. Reciprocal rank fusion over both is not an optimisation — without it, a whole category of question ' +
          'is unanswerable.',
      },
      {
        type: 'chart',
        chart: {
          kind: 'bars',
          title: 'Hybrid retrieval plus reranking carries the result',
          subtitle: 'Answer accuracy on a 420-question evaluation set',
          unit: '%',
          source: 'Identical prompt and generation settings across variants',
          data: [
            { label: 'Lexical only (BM25)', value: 58.3 },
            { label: 'Dense only', value: 64.1 },
            { label: 'Hybrid (RRF fusion)', value: 73.6 },
            { label: 'Hybrid + cross-encoder rerank', value: 81.2, emphasis: true },
          ],
        },
      },
      { type: 'h2', text: 'More context is not better context' },
      {
        type: 'p',
        text:
          'Past eight chunks, answer accuracy plateaued while citation precision fell off a cliff — the model kept ' +
          'answering correctly but attributing sloppily. Citation precision degrades earlier than accuracy, which makes ' +
          'it the better metric to set your operating point against.',
      },
      {
        type: 'note',
        text:
          'Build the evaluation set first. 420 questions with verified spans took three weeks and resolved every ' +
          'subsequent argument in minutes. Include questions the corpus cannot answer — otherwise you have no way to ' +
          'measure the refusal behaviour, which is the thing users judge you on.',
      },
    ],
  },

  {
    slug: 'typography-for-dense-interfaces',
    title: 'Typography for interfaces people stare at for nine hours',
    dek:
      'Editorial typography wants to impress you. Operational typography wants to disappear. Designing a dispatch board ' +
      'taught me the difference.',
    category: 'Craft',
    date: '2025-09-30',
    readingTime: 6,
    tags: ['Typography', 'Design systems', 'Accessibility'],
    body: [
      {
        type: 'lead',
        text:
          'I designed the Atlas dispatch board twice. The first version was beautiful and dispatchers hated it, because ' +
          'they do not read an interface — they scan the same eleven positions eight hundred times a day.',
      },
      { type: 'h2', text: 'Tabular figures are not optional' },
      {
        type: 'p',
        text:
          'Proportional digits make a column of numbers ragged, and a ragged column defeats scanning. `font-variant-numeric: ' +
          'tabular-nums` on every column of figures is the single highest-value line of CSS in an operational interface. ' +
          'It is also wrong for a large standalone number, where tabular spacing looks loose — so the rule is columns yes, ' +
          'display figures no.',
      },
      {
        type: 'list',
        items: [
          'One accent colour, reserved for exceptions. If everything can be highlighted, nothing is.',
          'Fewer weights than you want: two, plus size and colour, carries any hierarchy I have needed.',
          'Line height tighter than editorial, but never below 1.35 for anything a person reads as a sentence.',
          'Uppercase micro-labels get letter-spacing; lowercase body text never does.',
          'Every state must be legible without colour — a shape, a label, or a position as well as a hue.',
        ],
      },
      {
        type: 'quote',
        text: 'Editorial type invites you in. Operational type gets out of the way. Using the first where you need the second is the most common mistake I see in tools built by designers.',
      },
      {
        type: 'p',
        text:
          'The second version of the board used one typeface, two weights, tabular figures and a single accent — and was ' +
          'measurably faster to scan. It is also, to my eye, better looking, which I have stopped finding surprising.',
      },
    ],
  },
]

export const featuredArticles = articles.filter((a) => a.featured)

export function getArticle(slug: string | undefined): Article | undefined {
  return slug ? articles.find((a) => a.slug === slug) : undefined
}

export function relatedArticles(slug: string, count = 3): Article[] {
  return articles.filter((a) => a.slug !== slug).slice(0, count)
}

export const writingCategories = ['All', 'Engineering', 'Data Science', 'AI', 'Design', 'Craft'] as const
