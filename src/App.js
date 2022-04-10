import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {useState} from 'react';
import Home from './Pages/Home/Home';
import Chat from './Pages/Chat/Chat';
import Login from './Pages/Login/Login';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

function App() {
	const [room,setRoom] = useState('');
  return (
		<>
			<BrowserRouter>
					<Routes>
						<Route exact path="/" element={<Login />}/>
						<Route exact path="/chat" element={<Chat room={room}/>}/>
						<Route exact path="/home" element={<Home setRoom={setRoom}/>}/>
						<Route path="*" element={<Navigate to="/"/>} />
					</Routes>
			</BrowserRouter>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</>
  );
}

export default App;

