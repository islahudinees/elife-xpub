import config from 'config'
import { Selector } from 'testcafe'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  desktopNewSubmission: Selector('[data-test-id=desktop-new-submission]'),
  mobileNewSubmission: Selector('[data-test-id=mobile-new-submission]'),
  titles: Selector('[data-test-id=title]'),
  statuses: Selector('[data-test-id=status]'),
  trashButton: id =>
    Selector(`[href*="${id}"]`)
      .sibling('div')
      .child('[data-test-id=trash]'),
  continueSubmission: Selector('[data-test-id=continue-submission]'),
  continueSpecificSubmission: id => Selector(`[href*="${id}"]`),
}

export default dashboard
