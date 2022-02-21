import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Analytics from './views/Analytics';
import Home from './views/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:userId/:campaignSlug" element={<Analytics />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
