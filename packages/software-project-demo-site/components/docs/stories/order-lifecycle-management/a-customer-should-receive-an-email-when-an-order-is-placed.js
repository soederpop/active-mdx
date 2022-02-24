import React from 'react'
import Component from 'docs/stories/order-lifecycle-management/a-customer-should-receive-an-email-when-an-order-is-placed.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

