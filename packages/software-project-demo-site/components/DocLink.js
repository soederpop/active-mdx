import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function DocLink(props = {}) {
  const { children, absolute = false, onClick } = props
  const router = useRouter()

  if (!props.href) {
    return <a {...props} />
  }

  const resolveHref = (href) => {
    const base = router.asPath.split("/")
    const prefix = absolute ? "" : base.slice(0, base.length - 1).join("/")

    return href.replace(/\.\//, `/${prefix}/`).replace(/\/\//g, "/")
  }

  const href = String(props.href)

  if (href.startsWith(".")) {
    return (
      <Link href={resolveHref(href).replace(/\.mdx?$/, "")}>
        <a onClick={onClick}>{children}</a>
      </Link>
    )
  }

  return <a {...props} />
}
