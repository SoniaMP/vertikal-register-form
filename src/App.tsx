import { Box, Container } from "@mui/material";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ConfigProvider } from "./contexts";

function App() {
  return (
    <ConfigProvider>
      <Box sx={{ minHeight: "100vh", pt: 10, pb: 10 }}>
        <Header />
        <Container maxWidth="lg">
          <Box>
            <Home />
          </Box>
        </Container>
        <Footer />
      </Box>
    </ConfigProvider>
  );
}

export default App;
