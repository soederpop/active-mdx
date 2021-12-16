import MdxWrapper from "components/MdxWrapper"
import Navigation from "components/Navigation"
import MainLayout from "components/MainLayout"
import "semantic-ui-css/semantic.min.css"
import "styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <MdxWrapper>
      <MainLayout>
        <Navigation />
        <Component {...pageProps} />
      </MainLayout>
    </MdxWrapper>
  )
}

export default MyApp
