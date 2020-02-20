import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'

import Head from 'next/head'
import Header from '../components/header'


function RootApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Quake 3 Arena - 1.16n NoGhost Servers</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />

      <Component {...pageProps} />

      <style global jsx>
        {`
          body {
            background: #000000;
            color: #fefefe;
          }
          .form-control {
              background-color:#212121;
              color: #FFF;
          }
          .form-control:active {
              background-color:#212121;
              color: #FFF;
          }
          .form-control:active,
          .form-control:focus,
          .form-control:focus:active {
            background-color: #343434!important;
            border-color: #96d3ec;
            color: white;
          }
        `}
      </style>
    </div>
  )
}


// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }


export default RootApp