import Head from "next/head"
import { Container, Grid, Header } from "semantic-ui-react"
import EpicDemo from "content/demos/epic-demo.mdx"

export default function Home() {
  return (
    <div>
      <Head>
        <title>ActiveMDX - Structured Writing Data for React</title>
      </Head>
      <EpicDemo />
    </div>
  )
}
