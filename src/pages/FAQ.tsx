import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, MessageCircle, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

const faqs = [
  {
    question: "What is Acode?",
    answer: "Acode is a powerful, feature-rich code editor designed specifically for Android devices. It provides syntax highlighting for 100+ programming languages, plugin support, themes, and many other features that make coding on mobile devices efficient and enjoyable."
  },
  {
    question: "Is Acode free to use?",
    answer: "Yes, Acode is completely free and open-source. You can download it from the Google Play Store or F-Droid without any cost. Some premium plugins may have a cost, but the core editor is always free."
  },
  {
    question: "Which programming languages are supported?",
    answer: "Acode supports syntax highlighting and basic editing features for over 100 programming languages including JavaScript, Python, Java, C++, HTML, CSS, PHP, Ruby, Go, Rust, and many more. The language support is constantly expanding."
  },
  {
    question: "How do I install plugins?",
    answer: "You can install plugins directly from within the Acode app. Go to Settings > Plugins > Browse Plugins, search for the plugin you want, and tap Install. Some plugins may require additional permissions or setup."
  },
  {
    question: "Can I use Acode for web development?",
    answer: "Absolutely! Acode is excellent for web development. It supports HTML, CSS, JavaScript, and many web frameworks. You can also install plugins like Live Preview to see your changes in real-time."
  },
  {
    question: "Does Acode support Git integration?",
    answer: "Yes, through the Git Manager plugin, you can perform git operations like commit, push, pull, branch management, and more directly from your mobile device."
  },
  {
    question: "How do I change themes?",
    answer: "Go to Settings > Theme to choose from built-in themes. You can also install the Theme Studio plugin to create custom themes or download community-created themes from the plugin marketplace."
  },
  {
    question: "Can I work with large projects?",
    answer: "Yes, Acode is optimized to handle large projects efficiently. It features lazy loading, efficient memory management, and fast file searching to ensure smooth performance even with big codebases."
  },
  {
    question: "Is there cloud storage integration?",
    answer: "Acode supports working with local files and can integrate with cloud storage through plugins. You can connect to services like Google Drive, Dropbox, and others through the available plugins."
  },
  {
    question: "How do I get support?",
    answer: "You can get support through multiple channels: join our Discord community, post issues on GitHub, check the documentation at docs.acode.app, or reach out through the in-app feedback system."
  },
  {
    question: "Can I contribute to Acode?",
    answer: "Yes! Acode is open-source and welcomes contributions. You can contribute code, create plugins, report bugs, suggest features, or help with documentation. Check our GitHub repository for contribution guidelines."
  },
  {
    question: "What Android version is required?",
    answer: "Acode requires Android 5.0 (API level 21) or higher. The app is regularly tested on various Android versions to ensure compatibility and optimal performance."
  }
]

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about Acode. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 backdrop-blur-sm border-border"
          />
        </div>

        {/* FAQ Accordion */}
        <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search query or browse all questions above.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Join Our Community</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Connect with other developers, get help, and share your projects in our Discord community.
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Comprehensive guides, tutorials, and API documentation to help you master Acode.
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Docs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-primary/10 border-primary/20 mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
            <Button>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}