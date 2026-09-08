import type { ChartSpec } from '@/types'
import { LineChart } from './LineChart'
import { BarChart, ColumnChart } from './BarChart'
import { ScatterChart } from './ScatterChart'

/** Renders whichever chart a `ChartSpec` asks for. */
export function Chart({ spec, className }: { spec: ChartSpec; className?: string }) {
  switch (spec.kind) {
    case 'line':
      return (
        <div className={className}>
          <LineChart
            title={spec.title}
            subtitle={spec.subtitle}
            series={spec.series}
            xLabels={spec.xLabels}
            yUnit={spec.yUnit}
            source={spec.source}
          />
        </div>
      )
    case 'bars':
      return (
        <div className={className}>
          <BarChart
            title={spec.title}
            subtitle={spec.subtitle}
            data={spec.data}
            unit={spec.unit}
            source={spec.source}
          />
        </div>
      )
    case 'columns':
      return (
        <div className={className}>
          <ColumnChart
            title={spec.title}
            subtitle={spec.subtitle}
            data={spec.data}
            unit={spec.unit}
            source={spec.source}
          />
        </div>
      )
    case 'scatter':
      return (
        <div className={className}>
          <ScatterChart
            title={spec.title}
            subtitle={spec.subtitle}
            groups={spec.groups}
            xAxisLabel={spec.xAxisLabel}
            yAxisLabel={spec.yAxisLabel}
            source={spec.source}
          />
        </div>
      )
  }
}
