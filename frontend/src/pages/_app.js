import '@/styles/globals.css'
import { ConfigProvider } from 'antd'

export default function App({ Component, pageProps }) {
  return <ConfigProvider
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
  ><Component {...pageProps} />
  </ConfigProvider>
}
