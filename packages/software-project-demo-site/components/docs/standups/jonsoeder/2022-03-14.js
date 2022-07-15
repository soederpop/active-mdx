import React from 'react'
import Component from 'docs/standups/jonsoeder/2022-03-14.md'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

