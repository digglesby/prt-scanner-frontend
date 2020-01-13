import Document, { Head, Main, NextScript } from 'next/document';
import STATIC_PATH from '../STATIC_PATH.js';

class DocumentTemplate extends Document {

  render () {
    return (
      <html lang="en">
        <Head>
          <link rel="dns-prefetch" href="https://cdn.prtscanner.com"/>
          <link rel="apple-touch-icon" sizes="180x180" href={`${STATIC_PATH}/FavIcon/apple-touch-icon.png`}/>
          <link rel="icon" type="image/png" sizes="32x32" href={`${STATIC_PATH}/FavIcon/favicon-32x32.png`}/>
          <link rel="icon" type="image/png" sizes="16x16" href={`${STATIC_PATH}/FavIcon/favicon-16x16.png`}/>
          <link rel="manifest" href={`${STATIC_PATH}/FavIcon/site.webmanifest`}/>
          <link rel="mask-icon" href={`${STATIC_PATH}/FavIcon/safari-pinned-tab.svg`} color="#5bbad5"/>
          <link rel="shortcut icon" href={`${STATIC_PATH}/FavIcon/favicon.ico`}/>
          <meta name="msapplication-TileColor" content="#ffffff"/>
          <meta name="msapplication-config" content={`${STATIC_PATH}/FavIcon/browserconfig.xml`}/>
          <meta name="theme-color" content="#ffffff"/>

          <link rel='stylesheet' type='text/css' href={`${STATIC_PATH}/main.css`} />
          <meta name="google-site-verification" content="oCYauKaDXx_OyEAmxU8VyoQXQVubFt8CBtRXO8JLurw" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </Head>
        <body>
          <Main />
          <NextScript />

          <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700|Teko:500&display=swap" rel="stylesheet" />
        </body>
      </html>
    );
  }
}

export default DocumentTemplate;
