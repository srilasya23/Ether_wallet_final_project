
import React from 'react';

import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Owner from './screens/owner';
import Contribution from './screens/contribution';
function App() {
return (
	<Router>
	<Routes>
		<Route path='/owner' element={<Owner/>} />
		<Route path='/' element={<Contribution/>} />
	</Routes>
	</Router>
);
}

export default App;
