import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SponsorDashboard from './pages/SponsorDashboard'
import PlayerDashboard from './pages/PlayerDashboard'

function App() {

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/sponsor' element={<SponsorDashboard/>} />
            <Route path='/player' element={<PlayerDashboard/>} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App