import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from '@/hooks/useTheme'
import { Layout } from '@/components/layout/Layout'

export default function App() {
  return (
    <ThemeProvider>
      {/* `reducedMotion="user"` strips transform and layout animations for
          visitors who ask for it, while leaving opacity changes intact. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  )
}
