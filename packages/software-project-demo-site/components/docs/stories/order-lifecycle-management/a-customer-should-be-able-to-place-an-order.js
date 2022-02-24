import React from 'react'
import Component from 'docs/stories/order-lifecycle-management/a-customer-should-be-able-to-place-an-order.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

