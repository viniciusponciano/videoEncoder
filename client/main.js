import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from '../imports/ui/App';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

Meteor.startup(() => {
  render(
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>,
    document.getElementById('render-target'),
  );
});
