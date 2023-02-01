// routes
import AdminRouter from './routes/AdminRouter';
import LoginRouter from './routes/LoginRouter';
import FactoryRouter from './routes/FactoryRouter';
import AgencyRouter from './routes/AgencyRouter';
import GuaranteeRouter from './routes/GuaranteeRouter';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';


// ----------------------------------------------------------------------

export default function App() {
  return (
    sessionStorage.getItem('role') === 'admin' ? (
      <>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <AdminRouter />
        </ThemeProvider>
      </>
    ) :
      sessionStorage.getItem('role') === 'factory' ? (
        <>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <FactoryRouter />
          </ThemeProvider>
        </>
      ) :
        sessionStorage.getItem('role') === 'agency' ? (
          <>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <AgencyRouter />
            </ThemeProvider>
          </>
        ) :
          sessionStorage.getItem('role') === 'guarantee' ? (
            <>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <GuaranteeRouter />
              </ThemeProvider>
            </>
          ) : (
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <LoginRouter />
            </ThemeProvider>
          )

  );
}
