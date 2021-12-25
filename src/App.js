import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Pages/Home/Home';
import Chat from './Pages/Chat/Chat';

function App() {
  return (
    <BrowserRouter>
				<Routes>
					<Route exact path="/" element={<Home />}/>
					<Route exact path="/:search" element={<Chat />}/>
					<Route path="*" element={<Navigate to="/"/>} />
				</Routes>
		</BrowserRouter>
  );
}

export default App;

