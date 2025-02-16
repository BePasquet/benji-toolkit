import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BJJTechniques } from './bjj-techniques';

const theme = createTheme({});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <BJJTechniques />
    </ThemeProvider>
  );
}

export default App;
