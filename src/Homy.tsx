//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './Home.css'

function Home () {

	return (
		<div>
			<h1 className="text-center rochester-regular">Late Owls</h1>
			<img className="absolute top-0 m-[12px]" 
				src="../icons/bars-solid-full.svg" alt="menu"
				/>
			<div>
				<p className="text-center quantico-regular">Hello World</p>
				<div className="text-center quantico-regular">
					<button>PLAY</button>
				</div>
			</div>
		</div>
	)
}

export default Home