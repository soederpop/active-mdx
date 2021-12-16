import { useEffect, useState } from "react"
import { Dropdown, Divider, Header, Grid, Button } from "semantic-ui-react"
import Editor from "@monaco-editor/react"
import AstQuery from "active-mdx/src/AstQuery"
import NodeShortcuts from "active-mdx/src/NodeShortcuts"
import { CodeBlock, atomOneDark } from "react-code-blocks"
import AstQueryDocs from "content/api/AstQuery.mdx"
import NodeShortcutsDocs from "content/api/NodeShortcuts.mdx"
import vm from "isomorphic-vm"
import { toString } from "mdast-util-to-string"
import debounce from "lodash.debounce"

const defaultCode = `
/**
 * The output of the last line here will be displayed on the right
 * 
 * The following variables are defined for you
 * 
 * astQuery         - this is an instance of the AstQuery class for the document
 * nodes            - this is an instance of the NodeShortcuts class
 * toString(node)   - this is a function that will turn any AST node into a string
 */


// inspect the AST
// astquery.ast

// get the content of all h1 headings
// astQuery.selectAll('heading[depth=1]').map(toString)

// you can call toString on any node
nodes.headings.map(heading => toString(heading))
`

function ColorizedOutput({ value = "" }) {
  return (
    <CodeBlock
      text={value}
      language="json"
      showLineNumbers={false}
      theme={atomOneDark}
    />
  )
}

export default function Explorer(props = {}) {
  const { doc } = props
  const astQuery = new AstQuery(doc.ast)
  const nodes = new NodeShortcuts(astQuery)

  const [code, setCode] = useState(defaultCode)
  const [docs, setDocs] = useState("AstQuery")
  const [runCode, setRunCode] = useState(code)
  const [result, setResult] = useState([])

  useEffect(() => {
    getResult(runCode, {
      astQuery,
      toString,
      nodes,
      content: doc.content
    }).then((r) => {
      try {
        setResult(r)
      } catch (error) {}
    })
  }, [runCode])

  const updateCode = debounce((val) => setRunCode(val), 2000)

  return (
    <Grid columns={2} style={{ width: "100%", padding: 0, margin: 0 }}>
      <Grid.Column>
        <Header dividing as="h3">
          Ast Query Code
          <Header.Subheader>
            The output of the code will be displayed on the right
          </Header.Subheader>
        </Header>
        <Editor
          defaultLanguage="javascript"
          defaultValue={code.trim()}
          onChange={(value) => {
            setCode(value)
            updateCode(value)
          }}
          theme="vs-dark"
          height="400px"
          width="100%"
          options={{
            minimap: { enabled: false }
          }}
        />
        <Divider />
        Show Docs:
        <Dropdown
          fluid
          selection
          onChange={(e, { value }) => setDocs(value)}
          value={docs}
          options={[
            { text: "AstQuery", value: "AstQuery" },
            { text: "NodeShortcuts", value: "NodeShortcuts" }
          ]}
        />
        {docs == "AstQuery" ? <AstQueryDocs /> : <NodeShortcutsDocs />}
      </Grid.Column>
      <Grid.Column>
        <Header dividing as="h3">
          Results
        </Header>
        <div style={{ maxHeight: "600px", overflowY: "scroll" }}>
          <ColorizedOutput value={JSON.stringify(result, null, 2)} />
        </div>
      </Grid.Column>
    </Grid>
  )
}

export async function getStaticPaths() {
  const content = await import("content").then((m) => m.default)
  await content.load()

  const paths = content.available.map((catchAll) => ({
    params: { catchAll: catchAll.split("/") }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context = {}) {
  const content = await import("content").then((m) => m.default)
  const { params = {} } = context
  await content.load()

  let model

  try {
    model = doc.toModel()
  } catch (error) {}

  const documentId = params.catchAll.join("/")
  const doc = content.document(documentId)
  const extension = content.items.get(documentId).path.split(".").pop()

  return {
    props: {
      documentId,
      extension,
      model: (model && model.toJSON()) || {},
      doc: JSON.parse(JSON.stringify(doc.toJSON()))
    }
  }
}

async function getResult(code, context = {}) {
  const ctx = vm.createContext(context)
  const script = new vm.Script(code)

  try {
    console.log("Runnign Code")
    const result = await script.runInContext(ctx)
    return result
  } catch (error) {
    console.log("Oh no", error)
    return error
  }
}
