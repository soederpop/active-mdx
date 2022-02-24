import React from 'react'
import Component from 'docs/table-of-contents.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

