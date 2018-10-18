import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import PropTypes from 'prop-types'

const StatusBox = styled(Box)`
  color: ${props => props.theme[props.color]};
  font-size: 16px;
  padding-left: 24px;
  flex: 0 0 120px;
`

const mapColor = statusCode =>
  ({
    CONTINUE_SUBMISION: 'colorPrimary',
    WAITING_FOR_DECISION: 'colorPrimary',
    REJECTED: 'colorError',
  }[statusCode])

const getText = statusCode =>
  ({
    CONTINUE_SUBMISION: 'Continue Submision',
    WAITING_FOR_DECISION: 'Waiting for decision',
    REJECTED: 'Rejected',
  }[statusCode])

const ManuscriptStatus = ({ statusCode }) => (
  <StatusBox color={mapColor(statusCode)}>{getText(statusCode)}</StatusBox>
)

ManuscriptStatus.propTypes = {
  statusCode: PropTypes.string.isRequired,
}

export default ManuscriptStatus