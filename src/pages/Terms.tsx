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

const termsContent = `# Terms and Conditions

*Last updated: ${new Date().toLocaleDateString()}*

## Acceptance of Terms

By downloading, installing, or using Acode ("the App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the App.

## Description of Service

Acode is a mobile code editor application that provides:

- **Code Editing**: Advanced text editing capabilities for programming
- **Plugin System**: Extensible functionality through plugins
- **File Management**: Local and cloud file storage options
- **Syntax Highlighting**: Support for multiple programming languages
- **Development Tools**: Integrated development environment features

## User Accounts

### Account Creation
- You must provide accurate and complete information when creating an account
- You are responsible for maintaining the confidentiality of your account credentials
- You must notify us immediately of any unauthorized access to your account

### Account Responsibilities
- You are solely responsible for all activities under your account
- You must not share your account with others
- You must be at least 13 years old to create an account

## Acceptable Use Policy

### Permitted Uses
You may use Acode for:
- Personal and commercial software development
- Educational and learning purposes
- Creating and sharing plugins (subject to plugin guidelines)
- Collaborative development projects

### Prohibited Uses
You must not:
- **Illegal Activities**: Use the App for any unlawful purpose
- **Malicious Code**: Develop, distribute, or execute malware or harmful code
- **Intellectual Property Violation**: Infringe on copyrights, trademarks, or other rights
- **System Abuse**: Attempt to hack, disrupt, or damage our services
- **Spam or Harassment**: Send unsolicited content or harass other users
- **Reverse Engineering**: Attempt to decompile or reverse engineer the App

## Plugin Ecosystem

### Plugin Development
- Plugins must comply with our Plugin Guidelines
- You retain ownership of your original plugin code
- You grant us a license to distribute your plugins through our platform
- We reserve the right to remove plugins that violate these Terms

### Plugin Usage
- Plugins are provided by third-party developers
- We do not guarantee the functionality or security of third-party plugins
- Use plugins at your own risk and discretion

## Intellectual Property

### Our Rights
- Acode and its original features are protected by intellectual property laws
- Our trademarks, logos, and branding remain our exclusive property
- We reserve all rights not expressly granted to you

### Your Rights
- You retain ownership of the code and content you create using Acode
- You grant us a limited license to process and store your content to provide our services
- You represent that you have the right to use any content you upload or create

## Privacy and Data

Your privacy is important to us. Please review our [Privacy Policy](/privacy) to understand how we collect, use, and protect your information.

## Limitation of Liability

### Disclaimer
THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

### Limitation
IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE APP.

## Indemnification

You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
- Your use of the App
- Your violation of these Terms
- Your infringement of any intellectual property rights

## Termination

### By You
You may stop using the App at any time and delete your account through the app settings.

### By Us
We may terminate or suspend your account if you:
- Violate these Terms
- Engage in illegal activities
- Abuse our services or other users
- Remain inactive for an extended period

## Updates and Changes

### App Updates
- We may update the App to fix bugs, add features, or improve performance
- Some updates may be required for continued use
- We are not obligated to provide updates indefinitely

### Terms Changes
- We may modify these Terms from time to time
- We will notify you of significant changes through the App or email
- Continued use after changes constitutes acceptance of new Terms

## Governing Law

These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].

## Contact Information

For questions about these Terms, please contact us:

- **Email**: legal@acode.app
- **Support**: support@acode.app
- **GitHub**: https://github.com/deadlyjack/Acode
- **Discord**: https://discord.gg/acode

## Severability

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.

## Entire Agreement

These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the use of Acode.
`;

export default function Terms() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardContent className="p-8">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: md.render(termsContent) }}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}