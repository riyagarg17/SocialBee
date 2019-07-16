import React from 'react';
import Layout from './components/Layout';
import MainRouter from './mainRouter';
import { withRouter } from "react-router-dom";

function App(props) {
  return (
    <Layout currRoute={props.location.pathname}>
        <MainRouter/>
    </Layout>
  );
}

export default withRouter(App);
