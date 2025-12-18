//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './Home.css'

/*
function App() {
  const [count, setCount] = useState(0)

  return (
	<>
	  <div>
		<a href="https://vite.dev" target="_blank">
		  <img src={viteLogo} className="logo" alt="Vite logo" />
		</a>
		<a href="https://react.dev" target="_blank">
		  <img src={reactLogo} className="logo react" alt="React logo" />
		</a>
	  </div>
	  <h1>coucou</h1>
	  <div className="card">
		<button onClick={() => setCount((count) => count + 1)}>
		  42 is {count}
		</button>
		<p>
		  Edit <code>src/App.tsx</code> and save to test HMR
		</p>
	  </div>
	  <p className="read-the-docs">
		Click on the Vite and React logos to learn more stupidity
	  </p>
	</>
  )
}

function Home () {
	  const [count, setCount] = useState(0)

	return (
		<>
			<div className="bg-blue-500 text-white p-4">Hello World</div>
			<button onClick={() => setCount((count) => count + 1)}> 
				hello World :) = {count}
			</button>
		</>
	)
}

const [count, setCount] = useState(0)

<button onClick={() => setCount((count) => count + 1)}> 
hello World :) = {count}
</button>

export default App
*/

function Home () {

	return (
		<div>
			<h1 class="text-center rochester-regular">Late Owls</h1>
			<img class="absolute top-0 m-[12px]" src="../icons/bars-solid-full.svg" alt="menu"/>
			<div>
				<p class="text-center quantico-regular">Hello World</p>
				<div class="text-center quantico-regular">
					<button>PLAY</button>
				</div>
			</div>
		</div>
	)
}

export default Home