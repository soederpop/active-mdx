import React from 'react'
import Component from 'docs/stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-category.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

