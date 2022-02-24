import React from 'react'
import Component from 'docs/stories/order-lifecycle-management/a-store-administrator-should-be-able-to-cancel-an-order.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

