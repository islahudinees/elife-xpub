import * as yup from 'yup'
import {
  EDITOR_LIMITS,
  errorMessageMapping,
  manuscriptFileTypes,
} from './constants'

export const authorSchema = {
  author: yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .trim()
      .required('Email is required')
      .email('Must be a valid email address'),
    aff: yup.string().required('Institution is required'),
  }),
}

export const filesSchema = {
  coverLetter: yup
    .string()
    .required('Please write or paste in your cover letter.'),
  files: yup
    .array()
    .min(1, errorMessageMapping.EMPTY)
    .test(
      'at-least-one-manuscript',
      errorMessageMapping.EMPTY,
      arr =>
        arr
          .map(f => f.type === manuscriptFileTypes.MANUSCRIPT_SOURCE)
          .filter(f => f).length > 0,
    ),
  fileStatus: yup
    .string()
    .required()
    .oneOf(['READY'], 'Please wait until all files have uploaded.'),
}

const editorValidator = key =>
  yup
    .array()
    .min(
      EDITOR_LIMITS[key].min,
      `Please suggest at least ${EDITOR_LIMITS[key].min} editors`,
    )
    .max(
      EDITOR_LIMITS[key].max,
      `Please suggest no more than ${EDITOR_LIMITS[key].max} editors`,
    )

const opposedReasonValidator = key =>
  yup.string().when(key, {
    is: editors => !!editors.length,
    then: yup.string().required('Please provide a reason for exclusion'),
  })

export const editorsSchema = {
  suggestedSeniorEditors: editorValidator('suggestedSeniorEditors'),
  opposedSeniorEditors: editorValidator('opposedSeniorEditors'),
  opposedSeniorEditorsReason: opposedReasonValidator('opposedSeniorEditors'),
  suggestedReviewingEditors: editorValidator('suggestedReviewingEditors'),
  opposedReviewingEditors: editorValidator('opposedReviewingEditors'),
  opposedReviewingEditorsReason: opposedReasonValidator(
    'opposedReviewingEditors',
  ),
  suggestedReviewers: yup.array(
    yup.object().shape(
      {
        name: yup
          .string()
          .trim()
          .when('email', {
            is: email => email && email.length > 0,
            then: yup.string().required('Name is required'),
            otherwise: yup.string(),
          }),
        email: yup
          .string()
          .trim()
          .when('name', {
            is: name => name && name.length > 0,
            then: yup
              .string()
              .email('Must be a valid email')
              .required('Email is required'),
            otherwise: yup.string().email('Must be a valid email'),
          }),
      },
      ['name', 'email'],
    ),
  ),
  opposedReviewers: yup.array(
    yup.object().shape(
      {
        name: yup
          .string()
          .trim()
          .when('email', {
            is: email => email && email.length > 0,
            then: yup.string().required('Name is required'),
            otherwise: yup.string(),
          }),
        email: yup
          .string()
          .trim()
          .when('name', {
            is: name => name && name.length > 0,
            then: yup
              .string()
              .email('Must be a valid email')
              .required('Email is required'),
            otherwise: yup.string().email('Must be a valid email'),
          }),
      },
      ['name', 'email'],
    ),
  ),
  opposedReviewersReason: opposedReasonValidator('opposedReviewers'),
}

export const submissionSchema = {
  meta: yup.object().shape({
    title: yup.string().required('Title is required'),
    articleType: yup.string().required('Article type is required'),
    subjects: yup.array().when('articleType', {
      is: articleType => articleType && articleType === 'feature',
      then: yup
        .array()
        .of(yup.string())
        .max(2, `No more than 2 subject areas`),
      otherwise: yup
        .array()
        .of(yup.string())
        .min(1, `Choose at least 1 subject area`)
        .max(2, `No more than 2 subject areas`)
        .required('Subject area(s) required'),
    }),
  }),
  previouslyDiscussed: yup
    .string()
    .notOneOf(['', undefined], 'Please describe your previous interaction')
    .nullable(),
  previouslySubmitted: yup.array(
    yup
      .string()
      .notOneOf([''], 'Article title is required')
      .nullable(),
  ),
  firstCosubmissionTitle: yup
    .string()
    .notOneOf(['', undefined], 'Article title is required')
    .nullable(),
}

export const disclosureSchema = {
  submitterSignature: yup.string().required('Your name is required'),
  disclosureConsent: yup
    .bool()
    .required()
    .oneOf([true], 'We are unable to proceed without your consent'),
}

const wizardSchema = {
  ...authorSchema,
  ...filesSchema,
  ...submissionSchema,
  ...editorsSchema,
  ...disclosureSchema,
}

export default wizardSchema
