import Document, { Html, Head, Main, NextScript } from "next/document";

class FoodPlannerDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Plan your food for the week" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Dosis&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default FoodPlannerDocument;
