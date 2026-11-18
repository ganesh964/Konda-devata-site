
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Panchang } from './pages/Panchang'
import { Bhajans } from './pages/Bhajans'
import { Quotes } from './pages/Quotes'
import { Temples } from './pages/Temples'
import { Festivals } from './pages/Festivals'
import { Darshan } from './pages/Darshan'
import { Donate } from './pages/Donate'
import { Blog } from './pages/Blog'
import { About } from './pages/About'
import { Contact } from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="panchang" element={<Panchang />} />
          <Route path="bhajans" element={<Bhajans />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="temples" element={<Temples />} />
          <Route path="festivals" element={<Festivals />} />
          <Route path="darshan" element={<Darshan />} />
          <Route path="donate" element={<Donate />} />
          <Route path="blog" element={<Blog />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
