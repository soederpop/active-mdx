import React from 'react'
import Component from 'docs/stories/authentication/a-user-should-be-able-to-register.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

