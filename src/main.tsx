import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import Home from './Home.tsx'
import Register from './Register.tsx'
import Log from './Log.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Log />
	</StrictMode>
)
