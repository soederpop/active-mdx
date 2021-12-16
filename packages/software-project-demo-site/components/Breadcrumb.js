import { Breadcrumb } from "semantic-ui-react"
import { useCurrentDocument } from "./DocumentProvider"
import Link from "next/link"

export default function BreadcrumbNavigation(props = {}) {
  const { doc, model = {} } = useCurrentDocument()
  const { title } = model

  return (
    <Breadcrumb>
      <Breadcrumb.Section>
        <Link href="/">Home</Link>
      </Breadcrumb.Section>
      <Breadcrumb.Divider />
      <Breadcrumb.Section>{title}</Breadcrumb.Section>
    </Breadcrumb>
  )
}
