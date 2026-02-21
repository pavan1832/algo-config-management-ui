import React from 'react';
import Header from './components/Header';
import ConfigModal from './components/ConfigModal';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <HomePage />
      </main>
      <ConfigModal />
      <Toast />
    </div>
  );
}
