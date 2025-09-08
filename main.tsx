import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Home from './pages/Home'
import CreatorDetail from './pages/CreatorDetail'
import EditCreator from './pages/EditCreator'
import NewCreator from './pages/NewCreator'
import { SessionProvider } from './providers/SessionProvider'

const Root = () => (
  <React.StrictMode>
    <SessionProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="creator/:id" element={<CreatorDetail />} />
            <Route path="creator/:id/edit" element={<EditCreator />} />
            <Route path="new" element={<NewCreator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </SessionProvider>
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)
