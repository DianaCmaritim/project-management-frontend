import * as React from 'react'
import { createRoot } from "react-dom/client"
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import './css/index.css'



const root = createRoot(document.getElementById('root')).render(
  <React.Fragment>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </React.Fragment>
);
