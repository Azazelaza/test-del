import { useEffect } from 'react'
import TwoFactor from './components/ui/TwoFactor';
import { getAccessToken } from './helper/callApi';

function App() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      getAccessToken();
    }
  })

  return (
    <>
      {!token && <p>Loading token...</p>}
      {token && <TwoFactor />}
    </>
  )
}

export default App
