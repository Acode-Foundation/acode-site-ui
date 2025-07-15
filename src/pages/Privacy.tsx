import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>';
      } catch (__) { }
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const privacyContent = `# Privacy Policy

*Last updated: ${new Date().toLocaleDateString()}*

## Introduction

Welcome to Acode ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our mobile code editor application.

## Information We Collect

### Personal Information
- **Account Information**: When you create an account, we collect your email address, username, and encrypted password
- **Profile Data**: Optional profile information such as display name and avatar
- **Plugin Data**: Information about plugins you develop, install, or interact with

### Automatically Collected Information
- **Usage Analytics**: Information about how you use the app, including features accessed and time spent
- **Device Information**: Device type, operating system version, and app version
- **Crash Reports**: Anonymous crash logs to help us improve app stability

## How We Use Your Information

We use the collected information to:

- **Provide Services**: Enable core functionality of the code editor and plugin ecosystem
- **Account Management**: Maintain your account and provide customer support
- **App Improvement**: Analyze usage patterns to enhance features and performance
- **Security**: Protect against fraud, abuse, and security threats
- **Communications**: Send important updates about the app and services

## Data Sharing and Disclosure

We do not sell your personal information. We may share data only in these limited circumstances:

- **Service Providers**: With trusted third-party services that help us operate the app
- **Legal Requirements**: When required by law or to protect our rights and safety
- **Business Transfers**: In the event of a merger or acquisition (with user notification)

## Data Security

We implement industry-standard security measures including:

- **Encryption**: All data transmitted between your device and our servers is encrypted
- **Secure Storage**: Personal information is stored using advanced security protocols
- **Access Controls**: Limited access to personal data on a need-to-know basis
- **Regular Audits**: Periodic security assessments and updates

## Your Rights and Choices

You have the right to:

- **Access**: Request a copy of your personal data
- **Correction**: Update or correct your information
- **Deletion**: Request deletion of your account and associated data
- **Portability**: Export your data in a machine-readable format
- **Opt-out**: Disable analytics and non-essential data collection

## Data Retention

We retain your personal information only as long as necessary to provide our services or as required by law. Account data is typically deleted within 30 days of account closure.

## Children's Privacy

Acode is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover such information has been collected, we will delete it promptly.

## International Data Transfers

Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place to protect your privacy rights.

## Changes to This Policy

We may update this Privacy Policy periodically. We will notify users of significant changes through the app or email. Continued use of the app after changes constitutes acceptance of the updated policy.

## Contact Us

If you have questions about this Privacy Policy or our data practices, please contact us:

- **Email**: privacy@acode.app
- **GitHub**: https://github.com/deadlyjack/Acode
- **Discord**: https://discord.gg/acode

## Compliance

This Privacy Policy complies with applicable privacy laws, including GDPR, CCPA, and other relevant regulations.
`;

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardContent className="p-8">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: md.render(privacyContent) }}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}