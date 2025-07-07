import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import CategoriesTotalsChart from './components/CategoriesTotalsChart';
import ExpensesVsIncomeChart from './components/ExpensesVsIncomeChart';

function Analytics() {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Analytics
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        sx={{
          p: 2,
          ['& > *:not(:last-child)']: {
            mb: 2,
          },
        }}
      >
        <CategoriesTotalsChart />
        <ExpensesVsIncomeChart />
      </Box>
    </>
  );
}

export default Analytics;
