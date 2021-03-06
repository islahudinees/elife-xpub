import gql from 'graphql-tag'

import { manuscriptFragment } from './fragments'

export const updateSubmission = gql`
  mutation updateSubmission($data: ManuscriptInput!) {
    updateSubmission(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const SUBMIT_MANUSCRIPT = gql`
  mutation SubmitManuscript($data: ManuscriptInput!) {
    submitManuscript(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const UPLOAD_MANUSCRIPT_FILE = gql`
  mutation UploadFile($id: ID!, $file: Upload!, $fileSize: Int!) {
    uploadManuscript(id: $id, file: $file, fileSize: $fileSize) {
      id
      meta {
        title
      }
      files {
        downloadLink
        filename
        type
        status
        id
      }
      fileStatus
      suggestions {
        fieldName
        suggestions {
          value
          score
          updated
          method
        }
      }
    }
  }
`

export const UPLOAD_SUPPORTING_FILE = gql`
  mutation UploadFile($id: ID!, $file: Upload!) {
    uploadSupportingFile(id: $id, file: $file) {
      id
      meta {
        title
      }
      files {
        downloadLink
        filename
        type
        status
        id
      }
      fileStatus
    }
  }
`

export const DELETE_MANUSCRIPT_FILE = gql`
  mutation UploadFile($id: ID!) {
    removeUploadedManuscript(id: $id) {
      id
      files {
        downloadLink
        filename
        type
        status
        id
      }
    }
  }
`

export const DELETE_SUPPORTING_FILES = gql`
  mutation UploadFile($id: ID!) {
    removeSupportingFiles(id: $id) {
      id
      files {
        downloadLink
        filename
        type
        status
        id
      }
    }
  }
`

export const submitSurveyResponse = gql`
  mutation SubmitSurveyResponse($data: SurveySubmission!) {
    submitSurveyResponse(data: $data)
  }
`
