import React from 'react'
import Component from 'docs/stories/payment-processing/a-customer-should-be-able-to-pay-with-paypal.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

