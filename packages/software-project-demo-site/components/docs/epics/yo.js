import React from 'react'
import Component from 'docs/epics/yo.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

