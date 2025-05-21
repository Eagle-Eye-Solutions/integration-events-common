const jiraTicketRegex = /^[A-Z]+-\d+$/;

type Parsed = {
  ticket: string;
  subject: string;
};

export default {
  rules: {
    // 1. The first line of a Git commit message MUST be the subject of the commit.
    'subject-empty': [2, 'never'],

    // 2. The subject of the commit SHOULD be no more than 50 characters, but MUST NOT be more than 72 characters.
    'header-max-length': [2, 'always', 72],

    // 3. The subject of the commit MUST begin with the JIRA ticket number, followed by the subject text, separated by a colon.
    'jira-ticket-format': [2, 'always'],
    'type-empty': [2, 'always'],

    // 4. The subject text of the commit MUST begin with a capital letter. In our case, this is the first word after the ticket.
    'subject-case': [2, 'always', 'sentence-case'],

    // 5. The subject of the commit MUST NOT end with a period or any other form of punctuation.
    'header-full-stop': [2, 'never', ['.', ',', '?']],

    // 6. The subject text of the commit MUST be written using the imperative mood. Imperative mood sounds like a command e.g. Add instead of Added, Fix instead of Fixed.

    // 7. The Git commit message MAY contain a body if further explanation of the subject is necessary.
    'body-empty': [0, 'never'],

    // 8. The body of the Git commit message MUST be separated from the subject line by a blank line.
    'body-leading-blank': [2, 'always'],

    // 9. The body of the Git commit message MUST have a margin of no more than 72 characters.
    'body-max-line-length': [2, 'always', 72],

    // 10. The body of the Git commit message MUST explain what and why, rather than how, something was done.

    // 11. The body of the Git commit message MAY be broken into further paragraphs, which MUST be separated by blank lines.

    // 12. The body of the Git commit message MAY use Markdown for bullet points and other formatting.
  },
  parserPreset: {
    parserOpts: {
      // 3. The subject of the commit MUST begin with the JIRA ticket number, followed by the subject text, separated by a colon.
      parserOpts: {
        headerPattern: /^([A-Z]+-\d+)\s*: (.*)$/,
        headerCorrespondence: ['ticket', 'subject'],
      },
    },
  },
  plugins: [
    {
      rules: {
        'jira-ticket-format': (parsed: Parsed) => {
          const ticket = parsed.ticket;
          if (!jiraTicketRegex.test(ticket)) {
            return [false, 'Wrong format".'];
          }
          return [true];
        },
      },
    },
  ],
};
