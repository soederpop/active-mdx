import React from 'react'
import Component from 'docs/standups/soederpop/2022-03-15.md'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

