import React from 'react'
import Component from 'docs/decisions/headless-or-native-storefront.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

