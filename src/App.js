import React from 'react';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import MenuRecommendationSystem from './MenuRecommendationSystem'; // Import your main component

// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const clerkPubKey = "pk_test_YWRhcHRpbmctamFja2FsLTQ4LmNsZXJrLmFjY291bnRzLmRldiQ";
if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <Routes>
          <Route
            path="/sign-up/*"
            element={
              <div style={styles.centeredWrapper}>
                <SignUp routing="path" path="/sign-up" />
              </div>
            }
          />
          <Route
            path="/sign-in/*"
            element={
              <div style={styles.centeredWrapper}>
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <MenuRecommendationSystem />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  );
}

const styles = {
  centeredWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height for vertical centering
  },
};

export default App;