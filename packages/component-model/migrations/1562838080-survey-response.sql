CREATE TABLE survey_response (
  id UUID PRIMARY KEY,
  survey_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  response JSONB NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
