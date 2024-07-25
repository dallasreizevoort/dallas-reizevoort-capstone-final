import React, { useState } from "react";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import RedirectHandler from "./Auth/RedirectHandler";
import "./styles/partials/global.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import { SpotifyPlayerProvider } from "./Contexts/SpotifyPlayerContext";

/*TO DO:
1. Store token in server
2. Setup tablet and desktop responsive designs. Clean up mobile
3. Fix "Stats" dropdown
4. Fix Footer
5. Refactor code. Clean up unused code
6. Remove Console.logs
7. Make HTML and SCSS more semantic
8. Create database for user data. Store users song data to create
a "Compare to last visit" feature that will show updated song rankings.
9. Optimze code for performance
10. Test for more bugs.
11. fix create playlist description.
12. Add loading spinner and check for data before rendering.
13. First created playlist save returns null. works on all subsequent saves. Fix.
14. Remove defined but unused imports/variables.
15. Fix Settings cog position.
16. ESLint Cache and .pack files not being ignored. Looked into it, possibly because of the 
API wrapper.
*/


// UPDATES 6/19
// Components are rendering all time ranges each time. Need to fix.
// playlist generation needs update, not very curated results.


function App() {
  const code = new URLSearchParams(window.location.search).get('code');

  return (
    <Router>
      
      <AuthProvider code={code}>
      <SpotifyPlayerProvider>
        <RedirectHandler code={code} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard code={code} />} />
          <Route path="/" element={<Login />} />
        </Routes>
        </SpotifyPlayerProvider>
      </AuthProvider>
      
    </Router>
  );
}

export default App;