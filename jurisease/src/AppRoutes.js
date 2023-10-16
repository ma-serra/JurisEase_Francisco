import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ServiceSection from './ServiceSection';
import CEPServico from './CEPServico';
import IPVAServico from './IPVAServico';
import AgendamentoServico from './AgendamentoServico';

function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ServiceSection} />
        <Route path="/service-cep" component={CEPServico} />
        <Route path="/service-ipva" component={IPVAServico} />
        <Route path="/service-agendamento" component={AgendamentoServico} />
      </Switch>
    </Router>
  );
}

export default AppRoutes;
