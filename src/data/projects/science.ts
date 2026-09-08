import type { Project } from '@/types'

export const scienceProjects: Project[] = [
  {
    slug: 'kilimo-yield',
    title: 'Kilimo Yield',
    tagline: 'Forecasting maize yield eleven weeks before harvest, per county.',
    summary:
      'A seasonal yield forecasting model for smallholder maize across twelve agro-ecological zones, combining weather ' +
      'reanalysis, satellite vegetation indices and farm-level survey data — built to inform input financing decisions.',
    discipline: 'data',
    category: 'Predictive modelling · agriculture',
    year: '2025',
    role: 'Data scientist — framing, modelling, evaluation, reporting',
    client: 'Agricultural finance cooperative',
    timeline: '4 months',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'LightGBM', 'GeoPandas', 'Matplotlib', 'SQL'],
    featured: true,
    span: 'wide',
    links: { repo: 'https://github.com/brianmunga/kilimo-yield' },
    study: {
      overview:
        'A cooperative lends inputs — seed and fertiliser — against a harvest that has not happened yet. Their exposure ' +
        'depends on a yield they were estimating from last year’s number and a field officer’s intuition. This project ' +
        'replaced that with a forecast issued eleven weeks before harvest, at the resolution their loan book actually uses.',
      problem:
        'The cooperative was not short of data; it was short of a question. "Predict yield" is not decidable. The decidable ' +
        'question turned out to be: for this zone, in this season, what is the probability that average yield falls below ' +
        'the threshold at which our input loans stop being recoverable?',
      problemPoints: [
        'Ground-truth yield existed for only 38% of registered farms, and was self-reported.',
        'Weather stations are sparse; five of twelve zones had no station within 40km.',
        'Two growing seasons per year with different rainfall regimes, so naive time-series folds leak.',
        'The decision needed a distribution, not a point estimate — and by mid-season, not at harvest.',
      ],
      approach:
        'I reframed the target as zone-season average yield with a quantified interval, restricted the feature set to ' +
        'anything observable eleven weeks before harvest, and evaluated with a strictly forward-chaining split by season. ' +
        'Gradient boosting for the point estimate, quantile regression for the interval, and a per-zone baseline that the ' +
        'model had to beat before anyone was allowed to be impressed by it.',
      approachPoints: [
        'ERA5 rainfall and temperature reanalysis, aggregated to phenological windows rather than calendar months.',
        'MODIS NDVI peak and integral over the vegetative stage, extracted per zone polygon with GeoPandas.',
        'Survey features cleaned against a codebook; self-reported yields winsorised at the 2nd and 98th percentiles.',
        'LightGBM for the mean, quantile objectives at 0.1/0.5/0.9 for the band, calibrated against held-out seasons.',
      ],
      process: [
        {
          title: '01 — Framing the decision',
          body:
            'Three sessions with the credit committee to establish what number changes an action. The answer was a ' +
            'threshold probability, which changed the entire modelling target and saved a month of building the wrong thing.',
        },
        {
          title: '02 — Assembling the panel',
          body:
            'A zone-season panel joined from four sources in Postgres, with every join validated by row-count assertions. ' +
            'The survey data required a hand-written reconciliation for two seasons where the questionnaire had changed.',
        },
        {
          title: '03 — Feature work in phenological time',
          body:
            'Calendar aggregates performed poorly because planting dates shift by up to five weeks. Re-indexing rainfall ' +
            'and NDVI to days-after-planting was the single largest accuracy gain in the project — larger than any model change.',
        },
        {
          title: '04 — Honest validation',
          body:
            'Forward-chaining by season, never random k-fold. I also ran a zone-holdout to test generalisation to an ' +
            'unseen zone, which is the harder and more realistic failure mode. Reported both.',
        },
        {
          title: '05 — Reporting for a committee',
          body:
            'The deliverable is two pages per zone: the forecast band, the three features moving it, and an explicit ' +
            'statement of when the model should not be trusted. Notebooks were the working medium, not the product.',
        },
      ],
      stack: [
        { group: 'Analysis', items: ['Python 3.12', 'Pandas', 'NumPy', 'GeoPandas', 'Statsmodels'] },
        { group: 'Modelling', items: ['Scikit-learn', 'LightGBM', 'Quantile regression', 'SHAP', 'Optuna'] },
        { group: 'Data', items: ['PostgreSQL', 'ERA5 reanalysis', 'MODIS NDVI', 'Field survey (n=2,840)'] },
        { group: 'Reporting', items: ['Matplotlib', 'Jupyter', 'Quarto', 'Power BI'] },
      ],
      results: [
        { label: 'MAE', value: '0.21 t/ha', note: 'Forward-chained, held-out seasons' },
        { label: 'Improvement on baseline', value: '38%', note: 'Versus per-zone historical mean' },
        { label: 'Interval coverage', value: '88.4%', note: 'Nominal 80% band, slightly conservative' },
        { label: 'Lead time', value: '11 weeks', note: 'Before harvest, features observable' },
        { label: 'Zones covered', value: '12', note: 'Including five with no local station' },
      ],
      resultsNarrative:
        'The model beats the historical-mean baseline by 38% on mean absolute error, but the number the cooperative acted ' +
        'on was interval coverage. An 80% band that actually contains the outcome 88% of the time is usable for a lending ' +
        'decision; a sharper point estimate with unknown error is not. In the zone-holdout test error roughly doubles — ' +
        'which is stated plainly at the top of every report, because that is the condition under which someone might misuse it.',
      challenges: [
        {
          title: 'Self-reported ground truth',
          body:
            'Farmer-reported yields are biased and heaped on round numbers. I quantified the heaping, winsorised the tails, ' +
            'and validated a subsample against 210 crop-cut measurements. The residual bias is documented as a known ' +
            'limitation rather than smoothed away — the model inherits roughly a 6% optimistic tilt in two zones.',
        },
        {
          title: 'Leakage that looks like skill',
          body:
            'My first pipeline scored beautifully and was wrong: NDVI windows extended past the forecast date, so the model ' +
            'was reading the harvest it was predicting. I now generate features through an as-of function that takes the ' +
            'forecast date as an argument and physically cannot see beyond it.',
        },
        {
          title: 'Sparse weather coverage',
          body:
            'Interpolating from distant stations produced smooth, confidently wrong rainfall. Reanalysis data was less ' +
            'precise but unbiased across zones, which mattered more for a model comparing zones to each other.',
        },
      ],
      outcome:
        'Now issued every season for twelve zones and used as one input to input-financing limits. The cooperative reports ' +
        'that the band, not the estimate, is what changed the conversation in the credit committee.',
      next: [
        'Farm-level forecasts, conditional on getting non-self-reported yields for a representative subsample.',
        'Explicit drought-scenario conditioning rather than a single seasonal forecast.',
      ],
      analysis: {
        dataset: {
          name: 'Zone-season maize panel',
          rows: '2,840 farm surveys → 288 zone-season records',
          features: '46 engineered, 19 retained after selection',
          span: '2019A – 2024B (12 seasons)',
          source: 'Cooperative field survey · ERA5 reanalysis · MODIS NDVI · county statistics',
        },
        questions: [
          'How far ahead of harvest can zone-average yield be estimated within ±0.25 t/ha?',
          'Which observable signals carry the most information at that lead time?',
          'Can the model express uncertainty well enough to support a lending threshold?',
          'Does it generalise to a zone it has never seen?',
        ],
        methodology: [
          {
            title: 'Panel construction',
            body:
              'Farm surveys aggregated to zone-season means, joined to reanalysis and satellite series on zone polygon and ' +
              'phenological window. Row-count and null assertions at every join.',
          },
          {
            title: 'Feature engineering',
            body:
              'Rainfall totals and dry-spell counts re-indexed to days-after-planting; NDVI peak and integral over the ' +
              'vegetative stage; heat-stress day counts above 32°C; soil organic carbon; planting-date deviation from the zone norm.',
          },
          {
            title: 'Model selection',
            body:
              'Ridge, random forest and LightGBM compared under identical forward-chaining folds, hyperparameters tuned with ' +
              'Optuna on the training seasons only. LightGBM won on both error and interval quality.',
          },
          {
            title: 'Uncertainty',
            body:
              'Quantile objectives at 0.1/0.5/0.9 produce the band; coverage checked on held-out seasons and reported as ' +
              'achieved coverage rather than assumed.',
          },
        ],
        charts: [
          {
            kind: 'line',
            title: 'Forecast tracks the harvest across twelve seasons',
            subtitle: 'Zone-average maize yield, t/ha — prediction issued 11 weeks before harvest',
            xLabels: ['19A', '19B', '20A', '20B', '21A', '21B', '22A', '22B', '23A', '23B', '24A', '24B'],
            yUnit: ' t/ha',
            source: 'Held-out forward-chained seasons · n = 288 zone-season records',
            series: [
              {
                name: 'Actual',
                unit: ' t/ha',
                points: [
                  { x: 0, y: 2.42 },
                  { x: 1, y: 2.11 },
                  { x: 2, y: 2.68 },
                  { x: 3, y: 2.31 },
                  { x: 4, y: 3.02 },
                  { x: 5, y: 2.74 },
                  { x: 6, y: 2.19 },
                  { x: 7, y: 2.88 },
                  { x: 8, y: 3.21 },
                  { x: 9, y: 2.96 },
                  { x: 10, y: 3.34 },
                  { x: 11, y: 3.08 },
                ],
              },
              {
                name: 'Forecast',
                unit: ' t/ha',
                points: [
                  { x: 0, y: 2.51 },
                  { x: 1, y: 2.24 },
                  { x: 2, y: 2.6 },
                  { x: 3, y: 2.38 },
                  { x: 4, y: 2.9 },
                  { x: 5, y: 2.69 },
                  { x: 6, y: 2.35 },
                  { x: 7, y: 2.81 },
                  { x: 8, y: 3.12 },
                  { x: 9, y: 3.02 },
                  { x: 10, y: 3.26 },
                  { x: 11, y: 3.14 },
                ],
              },
            ],
          },
          {
            kind: 'bars',
            title: 'Rainfall timing outweighs rainfall total',
            subtitle: 'Relative feature importance (LightGBM gain, normalised to 100)',
            unit: '%',
            source: 'Mean gain across forward-chained folds; SHAP agreement on ordering',
            data: [
              { label: 'Cumulative rainfall, vegetative stage', value: 24.1, emphasis: true },
              { label: 'NDVI peak', value: 18.6 },
              { label: 'Soil organic carbon', value: 12.9 },
              { label: 'Planting-date deviation', value: 11.4 },
              { label: 'Nitrogen application rate', value: 9.8 },
              { label: 'Heat-stress days > 32°C', value: 8.7 },
              { label: 'Agro-ecological zone', value: 6.5 },
              { label: 'Previous-season yield', value: 4.9 },
              { label: 'Slope', value: 3.1 },
            ],
          },
          {
            kind: 'scatter',
            title: 'The rainfall–yield relationship is zone-specific',
            subtitle: 'Each point is one zone-season; the slope differs by altitude band',
            xAxisLabel: 'Vegetative-stage rainfall (mm)',
            yAxisLabel: 'Yield (t/ha)',
            source: '288 zone-season observations, 2019A–2024B',
            groups: [
              {
                name: 'Highland',
                points: [
                  { x: 280, y: 2.9 },
                  { x: 320, y: 3.15 },
                  { x: 355, y: 3.32 },
                  { x: 400, y: 3.48 },
                  { x: 430, y: 3.4 },
                  { x: 470, y: 3.22 },
                  { x: 300, y: 3.02 },
                  { x: 375, y: 3.41 },
                  { x: 415, y: 3.55 },
                  { x: 340, y: 3.1 },
                ],
              },
              {
                name: 'Midland',
                points: [
                  { x: 240, y: 2.2 },
                  { x: 285, y: 2.52 },
                  { x: 310, y: 2.71 },
                  { x: 350, y: 2.9 },
                  { x: 390, y: 3.05 },
                  { x: 425, y: 2.98 },
                  { x: 265, y: 2.35 },
                  { x: 330, y: 2.8 },
                  { x: 365, y: 2.95 },
                  { x: 300, y: 2.6 },
                ],
              },
              {
                name: 'Lowland',
                points: [
                  { x: 180, y: 1.4 },
                  { x: 215, y: 1.72 },
                  { x: 250, y: 2.0 },
                  { x: 275, y: 2.18 },
                  { x: 310, y: 2.3 },
                  { x: 340, y: 2.24 },
                  { x: 200, y: 1.55 },
                  { x: 235, y: 1.88 },
                  { x: 290, y: 2.26 },
                  { x: 325, y: 2.35 },
                ],
              },
            ],
          },
        ],
        insights: [
          {
            title: 'Timing beats volume',
            body:
              'Rainfall during the vegetative window carries more than twice the predictive weight of total seasonal ' +
              'rainfall. Two zones with identical season totals differed by 0.6 t/ha because one received its rain three weeks late.',
          },
          {
            title: 'Planting-date discipline is a lever, not a covariate',
            body:
              'Deviation from the zone-optimal planting date costs about 0.08 t/ha per week of delay. Unlike rainfall, this ' +
              'is actionable — it became the basis of an advisory the cooperative now sends before each season.',
          },
          {
            title: 'The lowland band needs its own model',
            body:
              'Residuals in the lowland zones are systematically wider and skewed. Pooling all zones borrows strength but ' +
              'understates lowland risk, which is precisely where the loan book is most exposed.',
          },
        ],
        conclusion:
          'Eleven weeks of lead time at 0.21 t/ha error is enough to change an input-financing limit, provided the interval ' +
          'is honest. The most valuable output was not the model but the reframing: from "what will yield be" to "what is ' +
          'the probability we fall below the recoverable threshold".',
      },
    },
  },

  {
    slug: 'signal-retention',
    title: 'Signal',
    tagline: 'Segmentation and churn propensity that a growth team could actually act on.',
    summary:
      'Behavioural segmentation and a calibrated churn-propensity model for a subscription product, delivered as five ' +
      'named segments, a monthly scored list and a dashboard the growth team runs without me.',
    discipline: 'data',
    category: 'Segmentation & propensity modelling',
    year: '2024',
    role: 'Data scientist & dashboard designer',
    client: 'B2C subscription product, ~140k accounts',
    timeline: '3 months',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'K-means', 'SQL', 'Power BI', 'Statistics'],
    span: 'half',
    links: { repo: 'https://github.com/brianmunga/signal-retention' },
    study: {
      overview:
        'The team knew their monthly churn number and nothing about its shape. Signal decomposed it: five behavioural ' +
        'segments with materially different retention curves, and a calibrated propensity score that ranks who to reach ' +
        'and — more usefully — who to leave alone.',
      problem:
        'Retention campaigns were sent to everyone who looked "at risk" by a hand-written rule. The rule mostly selected ' +
        'people who were about to leave regardless, so the campaign looked ineffective while quietly annoying a segment ' +
        'that was never going to churn.',
      problemPoints: [
        'A single aggregate churn rate concealed a 27-point spread across cohorts.',
        'The "at-risk" rule had never been evaluated against a holdout.',
        'Feature definitions differed between the SQL in the dashboard and the SQL in the campaign tool.',
        'No estimate of incremental effect, so spend could not be justified or stopped.',
      ],
      approach:
        'RFM-style behavioural features from the event log, standardised and reduced, then k-means with the cluster count ' +
        'chosen on silhouette and — crucially — on whether the resulting groups were describable in one sentence to a ' +
        'marketer. Separately, a calibrated propensity model with a holdout, and a lift curve as the only chart the team needed to read.',
      approachPoints: [
        'One dbt-style SQL layer defining every feature once, consumed by both the model and the dashboard.',
        'Feature set: recency, frequency, session depth, feature breadth, billing events, support contacts, tenure.',
        'K-means on standardised components, k chosen at 5 by silhouette plus interpretability; stability checked by bootstrap.',
        'Logistic regression and gradient boosting compared; logistic retained where the difference was inside the noise, for explainability.',
      ],
      process: [
        {
          title: '01 — Define churn precisely',
          body:
            'The team had three definitions in use. We settled on 45 days without a qualifying session, with a documented ' +
            'rationale from the observed return-probability curve — after 45 days, return probability falls below 6%.',
        },
        {
          title: '02 — One feature layer',
          body:
            'Rebuilt every feature as a single versioned SQL model. Two dashboard metrics moved by more than 10% on the ' +
            'first day, which is what a shared definition costs up front and saves thereafter.',
        },
        {
          title: '03 — Segmentation with a naming test',
          body:
            'Candidate solutions from k = 3 to 9. I required each cluster to survive a naming test: if I could not describe ' +
            'it in one sentence a marketer would recognise, the solution was rejected regardless of silhouette.',
        },
        {
          title: '04 — Propensity, calibrated',
          body:
            'Time-based split, isotonic calibration, and evaluation on lift by decile rather than accuracy — accuracy is ' +
            'meaningless at a 7% base rate. Reported the confusion matrix at the operating threshold the team would actually use.',
        },
        {
          title: '05 — Hand over the dashboard',
          body:
            'Power BI over the same SQL layer: segment sizes, retention curves, score distribution, and campaign results ' +
            'with a holdout group built into the report. The holdout is not optional in the template.',
        },
      ],
      stack: [
        { group: 'Analysis', items: ['Python', 'Pandas', 'NumPy', 'Scipy', 'Statsmodels'] },
        { group: 'Modelling', items: ['Scikit-learn', 'K-means', 'Logistic regression', 'Isotonic calibration', 'SHAP'] },
        { group: 'Data', items: ['PostgreSQL', 'Versioned SQL feature layer', 'Event log (1.2B rows)'] },
        { group: 'Delivery', items: ['Power BI', 'Matplotlib', 'Scheduled scoring job', 'Jupyter'] },
      ],
      results: [
        { label: 'ROC AUC', value: '0.83', note: 'Time-based holdout' },
        { label: 'Top-decile lift', value: '3.4×', note: 'Churners captured vs random' },
        { label: 'Campaign cost', value: '−45%', note: 'Same retained accounts, smaller audience' },
        { label: 'Incremental retention', value: '+2.1pp', note: 'Measured against an untouched holdout' },
        { label: 'Segments', value: '5', note: 'Each with a one-sentence definition' },
      ],
      resultsNarrative:
        'Targeting the top three deciles reaches 70% of churners. The team cut audience size by nearly half and held ' +
        'retained accounts flat, then measured a genuine +2.1pp incremental effect against a holdout — the first time the ' +
        'programme had a defensible number attached to it.',
      challenges: [
        {
          title: 'Clusters that were true but useless',
          body:
            'The best silhouette score came from a nine-cluster solution that split power users into six near-identical ' +
            'groups. Statistically clean, operationally worthless. I kept the naming test as a hard gate; it cost 0.04 ' +
            'silhouette and produced segments the team still uses by name.',
        },
        {
          title: 'Accuracy is the wrong number',
          body:
            'At a 7% base rate a model that predicts "stays" is 93% accurate. Getting the team to read a lift curve instead ' +
            'took a workshop and a deliberately absurd demonstration model. It was the highest-leverage hour of the project.',
        },
        {
          title: 'Predicting the intervention’s own effect',
          body:
            'Once campaigns fire on the score, the score influences the outcome it is measuring. The dashboard now bakes in ' +
            'a permanent 5% untouched holdout so both the model and the campaign remain measurable.',
        },
      ],
      outcome:
        'Scoring runs monthly and the growth team owns the dashboard. Two of the five segments turned out to warrant ' +
        'different pricing, which became a product decision rather than a marketing one.',
      analysis: {
        dataset: {
          name: 'Subscription behaviour panel',
          rows: '138,400 accounts · 1.2B raw events',
          features: '31 behavioural, 9 retained in the final model',
          span: 'Jan 2022 – Sep 2024',
          source: 'Product event log · billing system · support ticket export',
        },
        questions: [
          'Does churn have a shape, or is the aggregate rate the whole story?',
          'How many behavioural segments are both statistically distinct and operationally namable?',
          'Can we rank accounts well enough that a smaller audience retains as many people?',
          'What is the incremental effect of the retention campaign, measured honestly?',
        ],
        methodology: [
          {
            title: 'Churn definition',
            body:
              '45 days without a qualifying session, chosen from the empirical return-probability curve rather than convention.',
          },
          {
            title: 'Feature layer',
            body:
              'Recency, frequency, session depth, feature breadth, billing failures, support contacts and tenure — defined ' +
              'once in versioned SQL and shared by the model, the dashboard and the campaign tool.',
          },
          {
            title: 'Segmentation',
            body:
              'Standardised features, PCA to 8 components retaining 91% of variance, k-means with k selected on silhouette ' +
              'and interpretability, stability verified across 200 bootstrap resamples.',
          },
          {
            title: 'Propensity & evaluation',
            body:
              'Time-based split, logistic regression with isotonic calibration, evaluated on AUC, decile lift and calibration ' +
              'error. Uplift measured against a permanent untouched holdout.',
          },
        ],
        charts: [
          {
            kind: 'columns',
            title: 'Churn is concentrated in the first quarter of life',
            subtitle: '90-day churn rate by tenure cohort',
            unit: '%',
            source: 'n = 138,400 accounts, Jan 2022 – Sep 2024',
            data: [
              { label: '0–3 mo', value: 31.4, emphasis: true },
              { label: '4–6 mo', value: 19.8 },
              { label: '7–12 mo', value: 12.6 },
              { label: '13–24 mo', value: 7.9 },
              { label: '25+ mo', value: 4.2 },
            ],
          },
          {
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
          {
            kind: 'scatter',
            title: 'Three of the five segments separate cleanly on value and tenure',
            subtitle: 'Sampled accounts; the two mid-market segments are shown in the table view',
            xAxisLabel: 'Tenure (months)',
            yAxisLabel: 'Monthly value (USD)',
            source: '900-account stratified sample of the clustered population',
            groups: [
              {
                name: 'Anchors',
                points: [
                  { x: 28, y: 42 },
                  { x: 34, y: 48 },
                  { x: 31, y: 39 },
                  { x: 40, y: 52 },
                  { x: 37, y: 45 },
                  { x: 44, y: 58 },
                  { x: 33, y: 51 },
                  { x: 47, y: 55 },
                  { x: 29, y: 44 },
                  { x: 42, y: 49 },
                ],
              },
              {
                name: 'Climbers',
                points: [
                  { x: 9, y: 26 },
                  { x: 12, y: 31 },
                  { x: 14, y: 28 },
                  { x: 11, y: 34 },
                  { x: 16, y: 33 },
                  { x: 8, y: 22 },
                  { x: 13, y: 25 },
                  { x: 18, y: 36 },
                  { x: 10, y: 29 },
                  { x: 15, y: 30 },
                ],
              },
              {
                name: 'Drifters',
                points: [
                  { x: 2, y: 12 },
                  { x: 4, y: 9 },
                  { x: 3, y: 14 },
                  { x: 6, y: 11 },
                  { x: 5, y: 8 },
                  { x: 2, y: 7 },
                  { x: 7, y: 13 },
                  { x: 4, y: 16 },
                  { x: 6, y: 6 },
                  { x: 3, y: 10 },
                ],
              },
            ],
          },
        ],
        insights: [
          {
            title: 'Onboarding, not win-back',
            body:
              '31.4% of accounts churn within their first quarter, against 4.2% after two years. The highest-value ' +
              'intervention is in week one, which redirected the roadmap away from win-back email entirely.',
          },
          {
            title: 'Breadth predicts better than frequency',
            body:
              'The number of distinct features used in the first fourteen days is the strongest single predictor — stronger ' +
              'than session count. Depth of habit, not volume of activity.',
          },
          {
            title: 'One segment should be left alone',
            body:
              '"Anchors" have a 4% churn rate and a measurably negative response to retention messaging. Excluding them ' +
              'from campaigns was the cheapest improvement available.',
          },
        ],
        conclusion:
          'Aggregate churn is an average of five very different stories. Once the shape was visible, the argument stopped ' +
          'being about model quality and became a straightforward operational decision: fix the first fourteen days, and ' +
          'stop emailing the people who are already happy.',
      },
    },
  },

  {
    slug: 'mobility-atlas',
    title: 'Mobility Atlas',
    tagline: 'Mapping how a city actually moves, from 62 million fare records.',
    summary:
      'An exploratory and visual analysis of informal public-transport flows across a metropolitan area — corridor ' +
      'clustering, demand surfaces and an interactive atlas used in a transport-planning consultation.',
    discipline: 'data',
    category: 'Exploratory analysis · geospatial',
    year: '2024',
    role: 'Analyst, cartographer & visual designer',
    client: 'Urban mobility research group',
    timeline: '3 months',
    tags: ['Python', 'Pandas', 'GeoPandas', 'Scikit-learn', 'SQL', 'Matplotlib', 'Power BI'],
    span: 'wide',
    study: {
      overview:
        'The formal transport map of the city shows nine corridors. The fare data shows twenty-three. Mobility Atlas is ' +
        'the analysis and the printed/interactive atlas that made the difference visible to a planning audience — a project ' +
        'that sat exactly between my analytical and design practices.',
      problem:
        'Planning decisions were being made against a route map that described a licensing regime, not observed behaviour. ' +
        'Nobody disputed the data existed; it was 62 million rows of tap events with no spatial structure attached.',
      problemPoints: [
        'Tap events carried stage identifiers, not coordinates — geocoding had to be inferred from co-occurrence.',
        'Roughly 11% of records were duplicates or clock-skewed and had to be identified without discarding real short trips.',
        'Demand is strongly bimodal by time of day, so any single average map is misleading.',
        'The audience was non-technical: the output had to be legible in a room, on paper.',
      ],
      approach:
        'Build a trip table, infer stage geometry from co-occurrence, cluster origin–destination pairs into corridors, then ' +
        'design the atlas as carefully as the analysis. Every map in it answers one question and states its own uncertainty.',
      approachPoints: [
        'Trip reconstruction with a 90-minute transfer window, validated against a 4,000-trip manual sample.',
        'Stage coordinates estimated by multidimensional scaling on co-occurrence, then snapped to the road network.',
        'DBSCAN over OD-pair features to find corridors without pre-specifying how many exist.',
        'Small-multiple demand surfaces by hour band rather than one averaged map.',
      ],
      process: [
        {
          title: '01 — Cleaning at scale',
          body:
            'Chunked processing in Pandas with a deterministic duplicate rule, plus a clock-skew detector per device. ' +
            'The cleaning log is part of the deliverable: 6.9M records removed, each with a stated reason.',
        },
        {
          title: '02 — Inferring geometry',
          body:
            'Stage co-occurrence matrix → MDS → network snapping. Validated against 180 known stage locations, median error 140m.',
        },
        {
          title: '03 — Finding corridors',
          body:
            'DBSCAN on OD features surfaced 23 corridors, fourteen of which have no formal route designation. Four carry ' +
            'more daily trips than the median licensed corridor.',
        },
        {
          title: '04 — Designing the atlas',
          body:
            'Eighteen plates, one question each, on a consistent grid with a single accent for the finding. Typeset for ' +
            'print and reflowed for an interactive Power BI companion.',
        },
      ],
      stack: [
        { group: 'Analysis', items: ['Python', 'Pandas', 'NumPy', 'GeoPandas', 'Shapely'] },
        { group: 'Methods', items: ['DBSCAN', 'MDS', 'Kernel density estimation', 'Scikit-learn'] },
        { group: 'Data', items: ['PostgreSQL + PostGIS', '62M fare records', 'OpenStreetMap network'] },
        { group: 'Output', items: ['Matplotlib', 'Power BI', 'InDesign', 'Quarto'] },
      ],
      results: [
        { label: 'Records processed', value: '62M', note: 'Fare taps over 14 months' },
        { label: 'Corridors identified', value: '23', note: 'Against 9 formally designated' },
        { label: 'Unmapped high-demand routes', value: '14', note: 'Four above the median licensed corridor' },
        { label: 'Geocoding error', value: '140m', note: 'Median, against 180 known stages' },
        { label: 'Atlas plates', value: '18', note: 'Print and interactive' },
      ],
      resultsNarrative:
        'The finding that carried the consultation was not the count of corridors but a single plate: four unlicensed ' +
        'routes each carrying more daily trips than the median licensed one. That plate is deliberately the simplest in ' +
        'the atlas — one comparison, one accent colour, no second axis.',
      challenges: [
        {
          title: 'Geometry from no geometry',
          body:
            'Inferring locations from co-occurrence produces a map that is topologically right and metrically loose. Snapping ' +
            'to the road network fixed most of it; the residual error is printed on every map, because a 140m median matters ' +
            'for a stop-placement decision and not at all for a corridor-level one.',
        },
        {
          title: 'Averages that hide the city',
          body:
            'A single demand surface averaged the morning and evening peaks into a shape that exists at no hour of the day. ' +
            'Small multiples by hour band cost space and were the right answer.',
        },
      ],
      outcome:
        'The atlas was used in a public planning consultation, and the corridor definitions have been picked up by two ' +
        'follow-on studies. It is also the project I point to when someone asks what design has to do with data science.',
      analysis: {
        dataset: {
          name: 'Metropolitan fare-tap records',
          rows: '62.4M raw → 55.5M valid trips',
          features: 'Reconstructed OD pairs, hour band, corridor label',
          span: 'Mar 2023 – Apr 2024',
          source: 'Operator fare system · OpenStreetMap · 180 surveyed stage locations',
        },
        questions: [
          'How many corridors does observed demand actually describe?',
          'Where does demand exist without formal route designation?',
          'How does the demand surface change between morning and evening peaks?',
        ],
        methodology: [
          { title: 'Trip reconstruction', body: 'Tap sequences into trips with a 90-minute transfer window, validated on a 4,000-trip manual sample.' },
          { title: 'Stage geolocation', body: 'MDS on the co-occurrence matrix, snapped to the OSM road network; error quantified against surveyed stages.' },
          { title: 'Corridor clustering', body: 'DBSCAN over OD-pair features; parameters chosen by k-distance elbow and stability across monthly subsets.' },
          { title: 'Demand surfaces', body: 'Kernel density estimation per hour band, presented as small multiples with a shared scale.' },
        ],
        charts: [
          {
            kind: 'bars',
            title: 'Four unlicensed corridors outrank the median licensed one',
            subtitle: 'Average weekday trips, thousands — top ten corridors by volume',
            unit: 'k',
            source: '55.5M reconstructed trips, Mar 2023 – Apr 2024',
            data: [
              { label: 'C-04 · licensed', value: 148 },
              { label: 'C-11 · unlicensed', value: 131, emphasis: true },
              { label: 'C-02 · licensed', value: 126 },
              { label: 'C-17 · unlicensed', value: 119, emphasis: true },
              { label: 'C-06 · licensed', value: 104 },
              { label: 'C-19 · unlicensed', value: 98, emphasis: true },
              { label: 'C-01 · licensed', value: 91 },
              { label: 'C-23 · unlicensed', value: 84, emphasis: true },
              { label: 'C-08 · licensed', value: 77 },
              { label: 'C-05 · licensed', value: 62 },
            ],
          },
          {
            kind: 'line',
            title: 'The city has two peaks and they are not mirror images',
            subtitle: 'Share of daily trips by hour, inbound versus outbound',
            xLabels: ['5', '6', '7', '8', '9', '10', '12', '14', '16', '17', '18', '19', '20', '21'],
            yUnit: '%',
            source: 'Directional split by inferred corridor orientation',
            series: [
              {
                name: 'Inbound',
                unit: '%',
                points: [
                  { x: 0, y: 3.1 },
                  { x: 1, y: 8.4 },
                  { x: 2, y: 12.9 },
                  { x: 3, y: 11.2 },
                  { x: 4, y: 6.8 },
                  { x: 5, y: 4.2 },
                  { x: 6, y: 3.6 },
                  { x: 7, y: 3.9 },
                  { x: 8, y: 5.1 },
                  { x: 9, y: 6.4 },
                  { x: 10, y: 6.9 },
                  { x: 11, y: 5.2 },
                  { x: 12, y: 3.4 },
                  { x: 13, y: 1.9 },
                ],
              },
              {
                name: 'Outbound',
                unit: '%',
                points: [
                  { x: 0, y: 1.2 },
                  { x: 1, y: 2.6 },
                  { x: 2, y: 4.1 },
                  { x: 3, y: 4.8 },
                  { x: 4, y: 4.4 },
                  { x: 5, y: 4.6 },
                  { x: 6, y: 5.2 },
                  { x: 7, y: 6.1 },
                  { x: 8, y: 9.8 },
                  { x: 9, y: 13.4 },
                  { x: 10, y: 14.1 },
                  { x: 11, y: 10.2 },
                  { x: 12, y: 6.3 },
                  { x: 13, y: 3.2 },
                ],
              },
            ],
          },
        ],
        insights: [
          {
            title: 'Licensing lags behaviour by years',
            body:
              'Fourteen high-demand corridors have no formal designation. The map used for planning describes a permitting ' +
              'history, not a transport network.',
          },
          {
            title: 'The evening peak is broader and flatter',
            body:
              'Morning demand compresses into 90 minutes; evening demand spreads across four hours. Capacity planned on ' +
              'the morning shape over-serves the evening and vice versa.',
          },
        ],
        conclusion:
          'Sixty-two million rows contained a map nobody had drawn. The analytical work took six weeks; making it legible ' +
          'in a consultation room took another four, and that second half is what turned it into a decision.',
      },
    },
  },

  {
    slug: 'corpus-rag',
    title: 'Corpus',
    tagline: 'A retrieval system that refuses to answer when it should not.',
    summary:
      'A retrieval-augmented research assistant over 40,000 internal documents, built around a citation gate: every ' +
      'sentence must be traceable to a retrieved span, or the system declines and says why.',
    discipline: 'ai',
    category: 'Applied AI · retrieval systems',
    year: '2025',
    role: 'Engineer & evaluation lead',
    client: 'Policy research organisation',
    timeline: '4 months',
    tags: ['Python', 'FastAPI', 'Transformers', 'pgvector', 'React', 'TypeScript', 'Evaluation'],
    featured: true,
    span: 'wide',
    links: { repo: 'https://github.com/brianmunga/corpus' },
    study: {
      overview:
        'Researchers were spending hours finding the three paragraphs that mattered inside forty thousand documents. ' +
        'Corpus answers questions over that archive with inline citations, and — the part that took the longest — declines ' +
        'to answer when the retrieved evidence does not support one.',
      problem:
        'The first prototype was the standard recipe: chunk, embed, top-k, prompt. It was fluent, fast and wrong often ' +
        'enough that researchers stopped trusting it — which is worse than not having it, because a confident wrong answer ' +
        'costs more time than no answer.',
      problemPoints: [
        'Semantic search alone missed exact-term queries: statute numbers, programme codes, proper nouns.',
        'Fixed-size chunking cut tables and definitions in half, destroying the parts most often cited.',
        'No evaluation set, so every change was assessed by vibes and a demo query.',
        'The interface presented all answers with identical confidence, regardless of evidence quality.',
      ],
      approach:
        'Hybrid retrieval, structure-aware chunking, a cross-encoder reranker, and a hard citation gate at generation time. ' +
        'Before any of that: a 420-question evaluation set with human-verified answer spans, because nothing else can be ' +
        'measured without it.',
      approachPoints: [
        'BM25 + dense retrieval fused with reciprocal rank fusion — recovers exact-term queries semantic search loses.',
        'Structure-aware chunking on document headings, keeping tables and definition lists intact with a parent-child index.',
        'Cross-encoder reranking of the top 50 candidates down to the 8 that reach the model.',
        'Citation gate: each generated sentence must map to a retrieved span above a similarity floor, or the answer is withheld.',
      ],
      process: [
        {
          title: '01 — Build the evaluation set first',
          body:
            '420 questions written with the researchers, each with verified supporting spans and, deliberately, 60 questions ' +
            'the archive cannot answer. The unanswerable set is what measures the refusal behaviour, and it caught every ' +
            'regression that mattered.',
        },
        {
          title: '02 — Fix retrieval before touching prompts',
          body:
            'Recall@8 went from 0.62 to 0.89 through chunking and hybrid search alone. Most of what looks like a generation ' +
            'problem is a retrieval problem wearing a costume.',
        },
        {
          title: '03 — Rerank, then constrain',
          body:
            'A cross-encoder on the top 50 raised precision enough to reduce the context window, which improved both cost ' +
            'and answer focus. The citation gate then runs post-generation and can reject the model’s own output.',
        },
        {
          title: '04 — Design for uncertainty',
          body:
            'Three answer states in the interface: answered with citations, partial with a stated gap, and declined with the ' +
            'closest retrieved material shown anyway. The declined state is the one researchers said built their trust.',
        },
        {
          title: '05 — Continuous evaluation in CI',
          body:
            'The full evaluation suite runs on every prompt, model or index change. A drop in refusal precision fails the ' +
            'build exactly like a failing unit test.',
        },
      ],
      stack: [
        { group: 'Retrieval', items: ['pgvector', 'BM25 (Postgres FTS)', 'bge-large embeddings', 'bge-reranker cross-encoder'] },
        { group: 'Service', items: ['FastAPI', 'Pydantic', 'Celery ingestion', 'Redis cache', 'Server-sent events'] },
        { group: 'Interface', items: ['React', 'TypeScript', 'Tailwind CSS', 'Citation-anchored reader'] },
        { group: 'Evaluation', items: ['420-question suite', 'Ragas-style metrics', 'Refusal precision/recall', 'GitHub Actions'] },
      ],
      architecture: {
        caption: 'Retrieval is fused and reranked before generation; the citation gate is the last stage and can veto an answer.',
        layers: [
          {
            label: 'Ingestion',
            nodes: [
              { name: 'Document parser', note: 'PDF, DOCX, HTML' },
              { name: 'Structure-aware chunker', note: 'Heading-scoped', accent: true },
              { name: 'Embedding worker', note: 'Celery batch' },
            ],
          },
          {
            label: 'Index',
            nodes: [
              { name: 'pgvector', note: 'Dense, HNSW' },
              { name: 'Postgres FTS', note: 'Lexical BM25' },
              { name: 'Parent-child map', note: 'Chunk → section' },
            ],
          },
          {
            label: 'Query path',
            nodes: [
              { name: 'Hybrid retrieval', note: 'RRF fusion', accent: true },
              { name: 'Cross-encoder rerank', note: '50 → 8' },
              { name: 'Generation', note: 'Cited spans only' },
              { name: 'Citation gate', note: 'Can decline', accent: true },
            ],
          },
          {
            label: 'Client',
            nodes: [
              { name: 'Answer + citations' },
              { name: 'Evidence reader', note: 'Anchored to source' },
              { name: 'Feedback capture', note: 'Feeds the eval set' },
            ],
          },
        ],
      },
      results: [
        { label: 'Answer accuracy', value: '81.2%', note: 'Up from 58.3% on the baseline recipe' },
        { label: 'Recall@8', value: '0.89', note: 'From 0.62 with fixed chunking + dense only' },
        { label: 'Refusal precision', value: '96%', note: 'On the 60 unanswerable questions' },
        { label: 'Hallucinated citations', value: '0.4%', note: 'Down from 11.7%' },
        { label: 'p95 latency', value: '2.1s', note: 'Including rerank, streamed' },
        { label: 'Documents indexed', value: '40,300', note: '1.9M chunks' },
      ],
      resultsNarrative:
        'Accuracy rose 23 points, but the number that changed behaviour was refusal precision. Once the system reliably ' +
        'said "the archive does not answer this", researchers began using it for questions they cared about rather than ' +
        'questions they could already verify.',
      challenges: [
        {
          title: 'Fluency is not grounding',
          body:
            'The model would synthesise plausible sentences from adjacent but unsupporting spans. The citation gate — ' +
            'sentence-level span matching above a similarity floor, applied after generation — is a blunt instrument that ' +
            'cut hallucinated citations from 11.7% to 0.4% at the cost of some legitimate answers being withheld. Given the ' +
            'audience, that trade was correct.',
        },
        {
          title: 'Semantic search cannot find "Section 14(b)"',
          body:
            'Embeddings treat identifiers as noise. About 18% of real researcher queries contain one. Lexical retrieval ' +
            'fused into the pipeline was not an optimisation; without it the system failed at a whole category of question.',
        },
        {
          title: 'Evaluation is the actual product',
          body:
            'Building 420 verified questions took three weeks and felt like a delay. Every subsequent decision — chunk size, ' +
            'k, reranker, gate threshold — was resolved by running it, in minutes. Nothing else in the project returned as much time.',
        },
      ],
      outcome:
        'Corpus is in daily use by fourteen researchers. The evaluation suite has been extended by the organisation itself, ' +
        'and the refusal behaviour is now the feature they describe first when they show it to anyone.',
      next: [
        'Multi-hop questions, which currently fail gracefully but fail.',
        'Table-aware answering: numbers inside tables are retrieved well and reasoned about poorly.',
      ],
      analysis: {
        dataset: {
          name: 'Internal policy archive',
          rows: '40,300 documents · 1.9M chunks',
          features: 'Hybrid index: 1024-d dense vectors + lexical FTS',
          span: '1998 – 2025',
          source: 'Organisation archive (PDF, DOCX, HTML) · 420-question human-verified evaluation set',
        },
        questions: [
          'Which retrieval strategy actually answers researcher questions?',
          'How much context does the generator need, and how much hurts it?',
          'Can the system be made to decline reliably rather than guess?',
        ],
        methodology: [
          { title: 'Evaluation harness', body: '420 questions with verified spans, including 60 unanswerable, scored on answer accuracy, citation precision and refusal behaviour.' },
          { title: 'Retrieval ablation', body: 'Lexical, dense, RRF-fused and fused-plus-reranked variants under identical prompts and generation settings.' },
          { title: 'Context sizing', body: 'Accuracy and citation precision measured across top-k from 2 to 12 to find where extra context starts to dilute the answer.' },
        ],
        charts: [
          {
            kind: 'bars',
            title: 'Hybrid retrieval plus reranking carries the result',
            subtitle: 'Answer accuracy on the 420-question evaluation set',
            unit: '%',
            source: 'Identical prompt and generation settings across variants',
            data: [
              { label: 'Lexical only (BM25)', value: 58.3 },
              { label: 'Dense only', value: 64.1 },
              { label: 'Hybrid (RRF fusion)', value: 73.6 },
              { label: 'Hybrid + cross-encoder rerank', value: 81.2, emphasis: true },
            ],
          },
          {
            kind: 'line',
            title: 'More context is not better context',
            subtitle: 'Accuracy and citation precision by number of retrieved chunks',
            xLabels: ['2', '4', '6', '8', '10', '12'],
            yUnit: '%',
            source: '420-question evaluation set; k = 8 selected as the operating point',
            series: [
              {
                name: 'Answer accuracy',
                unit: '%',
                points: [
                  { x: 0, y: 61.4 },
                  { x: 1, y: 72.8 },
                  { x: 2, y: 79.1 },
                  { x: 3, y: 81.2 },
                  { x: 4, y: 80.4 },
                  { x: 5, y: 78.6 },
                ],
              },
              {
                name: 'Citation precision',
                unit: '%',
                points: [
                  { x: 0, y: 97.1 },
                  { x: 1, y: 96.4 },
                  { x: 2, y: 95.2 },
                  { x: 3, y: 94.1 },
                  { x: 4, y: 90.3 },
                  { x: 5, y: 85.7 },
                ],
              },
            ],
          },
        ],
        insights: [
          {
            title: 'Retrieval quality dominates',
            body:
              'Two thirds of the total accuracy gain came from chunking and hybrid retrieval — before any change to the prompt or the model.',
          },
          {
            title: 'Precision degrades before accuracy does',
            body:
              'Past eight chunks, answers stay roughly as accurate but cite less precisely. Citation precision is the earlier ' +
              'warning signal, which makes it the better metric to gate on.',
          },
          {
            title: 'A good refusal is a feature',
            body:
              '96% refusal precision on unanswerable questions is what moved researchers from spot-checking the system to relying on it.',
          },
        ],
        conclusion:
          'The interesting engineering in a retrieval system is not the model. It is the evaluation set, the retrieval ' +
          'strategy and the willingness to ship something that says no.',
      },
    },
  },
]
