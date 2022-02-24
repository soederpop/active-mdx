import React from 'react'
import Component from 'docs/stories/content-management/a-content-moderator-should-be-able-to-manage-blog-posts.mdx'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

