import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'
import List from '../../components/List'

const WritingTheReview = props => (
  <React.Fragment>
    <H1>Writing the Review</H1>

    <H2>Article Selection Criteria</H2>

    <Paragraph.Reading>
      eLife’s{' '}
      <NativeLink
        href="http://elifesciences.org/about#aims-and-scope"
        target="_blank"
      >
        scope
      </NativeLink>{' '}
      is broad and inclusive, covering the full range of biomedical and life
      science research, from the most basic and theoretical work through to
      translational, applied and clinical research. We seek to publish all
      highly influential research in these fields, whereby influence is
      interpreted in the broadest sense to cover the advance in understanding,
      potential to drive a field forward, and real-world outcomes. Articles must
      be methodologically and scientifically rigorous, ethically conducted, and
      objectively presented according to the appropriate community standards.
    </Paragraph.Reading>

    <H2>Your Review</H2>

    <Paragraph.Reading>
      You will be asked for a general assessment of the work (ideally in fewer than 100 words), 
      a numbered summary of any substantive concerns (ideally in fewer than 500 words), and a 
      list of any minor comments or corrections. If you want to state that something is already 
      known, and either contradicts or duplicates a major conclusion of the manuscript, please 
      support this with appropriate references. When writing your review, please consider these important 
      questions  and evaluate the paper as submitted:
    </Paragraph.Reading>

    <List.Ordered>
      <li>
        Does the work warrant publication in eLife in principle?
      </li>
      <li>
        If the current conclusions warrant publication in eLife, but are not 
        fully supported by the existing data, can this be easily addressed? 
        If not, the submission should be rejected.
      </li>
      <li>
        Is the paper suitable for publication in eLife as it stands, even if 
        the paper would be stronger with additional work? In other words, are 
        the major conclusions, with potentially minor adjustments, justified 
        without additional experiments, analyses, or data collection? In these 
        circumstances, we should limit requests for revision to issues of 
        clarity and presentation.
      </li>
         <li>
        Do the major conclusions require a modest amount of additional new data 
        or analyses to be fully supported? If so, we should ask the authors to 
        alter their claims or make clear which conclusions require what additional 
        supporting data. (Once such experiments are done, the authors can publish 
        them on a preprint server and/or submit a Research Advance in future.) This 
        option reflects the difficulty that many labs are currently facing in acquiring new data.
      </li>
        <li>
        Does the work have potential but require essential additional data to support the central 
        claims of the paper? In these cases we should ask for revisions (without a deadline) and 
        encourage the authors to post the paper to a preprint server along with the reviews from 
        eLife. Please ensure that any requests for new work fall within the scope of the current 
        submission and the technical expertise of the authors.
      </li>
    </List.Ordered>

    <Paragraph.Reading>
      When revisions are requested, the Reviewing Editor’s decision letter will usually only contain 
      the most relevant review comments, with any subsequent resubmission assessed only by the 
      original Reviewing Editor in most cases. These principles are intended to accelerate scientific 
      progress by promoting modes of communication whereby new results are made available quickly, 
      penly, and in a way that helps others to build upon them.
    </Paragraph.Reading>

    <Paragraph.Reading>
      In the interests of transparency and reproducibility, eLife asks authors
      to complete our transparent reporting form with information relating to
      sample-size estimation, replicates, and statistical reporting. The form is
      available to download and consider alongside the other manuscript files.
    </Paragraph.Reading>

    <Paragraph.Reading>
      eLife is a member of the Committee on Publication Ethics (COPE), supports
      their principles, and follows their flowcharts for dealing with potential
      breaches of{' '}
      <Link to="/author-guide/journal-policies">publishing ethics</Link>.
      Reviewers are asked not make allegations of misconduct within the review
      itself or within the online consultation, but in the event of concerns
      about potential plagiarism, inappropriate image manipulation, or other
      forms of misconduct, reviewers should alert the journal’s editorial staff
      in the first instance. The editorial staff will consult the Senior Editor
      and Reviewing Editor, and consider the concerns further.
    </Paragraph.Reading>

    <H2>Submitting the Review</H2>

    <Paragraph.Reading>
      You will be asked to confirm that you do not have any competing interests
      to declare; that you disclose the name(s) of anybody with whom you have
      discussed the article, or who has assisted in the review process
      (including co-reviewing for training purposes); whether you want to remain
      anonymous; and whether you agree to allow us to share your full review and
      identity with other journals in the event of rejection.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The main part of the review consists of a general assessment (ideally in fewer than 100 words), 
      a numbered summary of any substantive concerns (ideally in fewer than 500 words), and a list of 
      any minor comments or corrections. Please be aware that in the event of acceptance, the decision 
      letter containing the integrated review comments will be published.
    </Paragraph.Reading>

<Paragraph.Reading>
        Implicit bias (unconscious associations that affect our actions) has repeatedly been shown to 
        influence decisions in scholarly publishing, especially with respect to author gender, career stage, 
          nationality and other social groupings. To help increase awareness of what implicit bias is and 
          how it might affect the eLife review process we encourage editors and reviewers to consult resources 
          such as{' '}
      <NativeLink
        href="https://implicit.harvard.edu/implicit/takeatest.html"
        target="_blank"
      >
        Project Implicit
      </NativeLink>{' '} 
          and{' '}
      <NativeLink
        href="https://outsmartinghumanminds.org/"
        target="_blank"
      >
        Outsmarting Human Minds
      </NativeLink>.
</Paragraph.Reading>          
  </React.Fragment>
)

export default WritingTheReview
