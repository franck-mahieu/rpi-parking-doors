import 'materialize-css/dist/css/materialize.min.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Footer } from './layouts/Footer/Footer';
import { Navbar } from './layouts/Navbar/Navbar';
import { ManagedUsers } from './pages/ManagedUsers/ManagedUsers';
import relays from './pages/Relays/Relays';

const App = () => {
  const [guid, setGuid] = useState('');
  const [userRoles, setUserRoles] = React.useState('');

  return (
    <BrowserRouter>
      <header>
        <Navbar
          setGuid={setGuid}
          guid={guid}
          setUserRoles={setUserRoles}
          userRoles={userRoles}
        />
      </header>
      <main>
        <Switch>
          <Route exact path="/">
            <relays.Relays guid={guid} />
          </Route>
          <Route path="/admin/manageusers/">
            <ManagedUsers guid={guid} />
          </Route>
        </Switch>
      </main>
      <footer>
        <Footer />
      </footer>
    </BrowserRouter>
  );
};
export default App;
