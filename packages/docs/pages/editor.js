import ReactComponentLiveEditor from "components/ReactComponentLiveEditor"

export default function EditorPage() {
  const dependencies = {
    "@chakra-ui/react": "^1.7.2",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0",
    "framer-motion": "^4.0.0"
  }

  return <ReactComponentLiveEditor dependencies={dependencies} />
}
