import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Generate from './pages/Generate'
import GenerateSuccess from './pages/GenerateSuccess'
import Supporters from './pages/Supporters'
import Statistics from './pages/Statistics'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generate/success" element={<GenerateSuccess />} />
        <Route path="/supporters" element={<Supporters />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
