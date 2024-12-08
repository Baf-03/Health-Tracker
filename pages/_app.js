// pages/_app.js

import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthProvider>
        <Navbar /> 
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer />
    </AuthProvider>
  );
}

export default MyApp;
