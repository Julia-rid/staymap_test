import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
// Placeholder imports for future pages
// import QuoteBuilder from './pages/QuoteBuilder';
// import QuoteResult from './pages/QuoteResult';
// import PurchaseForm from './pages/PurchaseForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          {/* <Route path="quote" element={<QuoteBuilder />} /> */}
          {/* <Route path="result" element={<QuoteResult />} /> */}
          {/* <Route path="checkout" element={<PurchaseForm />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
