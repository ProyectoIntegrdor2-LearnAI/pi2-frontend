import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';

const Login = () => {
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authInitialTab, setAuthInitialTab] = useState('login');

  return (
    <div className="login-page">
      <AuthModal
        showAuthModal={showAuthModal}
        closeAuthModal={() => setShowAuthModal(false)}
        initialTab={authInitialTab}
      />
    </div>
  );
};

export default Login;
