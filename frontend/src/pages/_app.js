import { getConfig } from '@/config';
import '@/styles/globals.css'
import { useRouter } from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react'
import { ConfigProvider } from 'antd'
import { useEffect } from 'react';

const useOnRedirectCallback = (appState) => {
  const router = useRouter();
  router.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig();

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

export default function App({ Component, pageProps }) {
  var providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    onRedirectCallback: useOnRedirectCallback,
    cacheLocation: "localstorage",
    authorizationParams: {
      // redirect_uri: window.location.origin,
      redirect_uri: null,
      ...(config.audience ? { audience: config.audience } : null),
    }
  }

  return (
    <Auth0Provider
      {...providerConfig}
    >
      <ConfigProvider
        theme={{
          token: {
            colorText: 'black', // text color
            colorTextLight: '#BFBFBF', // light text color
            colorTextInvert: 'white', // inverted text color
            colorPrimary: 'black', // primary color
            colorBgBase: '#F5F5F5', // background color
            colorSecondary: '#EBEBEB', // background color
            colorAccent: '#51237A', // accent color
          },
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </Auth0Provider>

  )
}
