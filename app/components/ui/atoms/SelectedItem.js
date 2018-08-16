import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import Icon from './Icon'

const CrossIcon = props => (
  <Icon iconName="X" overrideName="@pubsweet-pending.Tags.Remove" {...props} />
)

const StyledIcon = styled(CrossIcon)`
  margin-left: ${th('space.1')};
  cursor: pointer;
  fill: ${th('colorTextReverse')};
`

const Root = styled.div`
  border-radius: ${th('borderRadius')};
  background-color: ${th('colorPrimary')};
  line-height: ${th('fontLineHeightBase')};
  padding: ${th('space.1')} ${th('space.2')} ${th('space.1')} ${th('space.2')}
  color: ${th('colorTextReverse')};
  display: inline-flex;
  align-items: center;
`

const SelectedItem = ({ label, onCloseClick }) => (
  <Root>
    {label} <StyledIcon onClick={onCloseClick} />
  </Root>
)

export default SelectedItem
