import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import { store } from '../store';
import { MantineProvider } from '@mantine/core';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { AppShellDemo } from '../components/appshell';

library.add(fas)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider 
      withGlobalStyles 
      withNormalizeCSS
      theme={{
        colorScheme: 'light', 
        fontFamily: 'arial'
      }}
    >
      <Provider store={store}>
        <AppShellDemo>
          <Component {...pageProps} />
        </AppShellDemo>
      </Provider>
    </MantineProvider>
  )

}

export default MyApp
