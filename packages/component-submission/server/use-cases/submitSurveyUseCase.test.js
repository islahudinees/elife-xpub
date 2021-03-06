const { useCase, makeResponseObject } = require('./submitSurveyUseCase')

describe('submitSurveyUseCase', () => {
  describe('useCase', () => {
    it('does not supress errors', async () => {
      const mockSurveyResponse = jest.fn(() => ({
        save: jest.fn().mockRejectedValue(undefined),
      }))
      return expect(
        useCase(
          { SurveyResponse: mockSurveyResponse },
          { surveyId: '', submissionId: '', answers: [], userId: '' },
        ),
      ).rejects.toEqual(undefined)
    })

    it('calls the save function and returns true', async () => {
      const mockSurveyResponse = jest.fn(() => ({
        save: jest.fn().mockResolvedValue(true),
      }))

      return expect(
        useCase(
          { SurveyResponse: mockSurveyResponse },
          { surveyId: '', submissionId: '', answers: [], userId: '' },
        ),
      ).resolves.toEqual(true)
    })
  })
  describe('makeResponseObject', () => {
    it('transforms the input type into the database type', () => {
      const input = [
        {
          questionId: 'question1',
          text: "What's your favourite kind of sock?",
          answer: 'answer1',
        },
        {
          questionId: 'question2',
          text: 'WHY ARE YOU RUNNING?',
          answer: 'answer2',
        },
        {
          questionId: 'question3',
          text: 'What?',
          answer: 'answer3',
        },
        {
          // There shouldn't be duplicate question answers, but if there is, what happens?
          questionId: 'question3',
          text: 'What?',
          answer: 'answer3',
        },
      ]

      const result = makeResponseObject(input)

      expect(result).toEqual({
        questions: [
          {
            id: 'question1',
            question: "What's your favourite kind of sock?",
          },
          {
            id: 'question2',
            question: 'WHY ARE YOU RUNNING?',
          },
          {
            id: 'question3',
            question: 'What?',
          },
        ],
        answers: [
          {
            questionId: 'question1',
            answer: 'answer1',
          },
          {
            questionId: 'question2',
            answer: 'answer2',
          },
          {
            questionId: 'question3',
            answer: 'answer3',
          },
        ],
      })
    })
  })
})
