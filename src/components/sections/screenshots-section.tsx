import { Smartphone, Monitor, Tablet } from "lucide-react"

export function ScreenshotsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-acode-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-acode-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Beautiful on
            <span className="bg-gradient-primary bg-clip-text text-transparent"> every device</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Acode adapts perfectly to any screen size, from phones to tablets to desktop displays.
          </p>
        </div>

        {/* Device Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Mobile View */}
          <div className="text-center animate-slide-up">
            <div className="relative mx-auto mb-6">
              <div className="w-64 h-96 bg-gradient-to-b from-card/80 to-card/40 rounded-3xl border border-border p-4 backdrop-blur-sm shadow-elegant">
                <div className="w-full h-full bg-acode-darker rounded-2xl p-3 relative overflow-hidden">
                  {/* Mobile Screenshot Mockup */}
                  <div className="text-xs font-mono text-green-400 mb-2">~/projects/my-app</div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-blue-400">import</div>
                    <div className="text-purple-400">function App() {"{"}</div>
                    <div className="text-white pl-4">return (</div>
                    <div className="text-yellow-400 pl-8">&lt;div&gt;</div>
                    <div className="text-white pl-12">Hello World</div>
                    <div className="text-yellow-400 pl-8">&lt;/div&gt;</div>
                    <div className="text-white pl-4">)</div>
                    <div className="text-purple-400">{"}"}</div>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 h-8 bg-secondary/50 rounded-lg flex items-center px-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <div className="text-xs text-muted-foreground">index.js</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Smartphone className="w-5 h-5" />
              <span>Mobile</span>
            </div>
          </div>

          {/* Tablet View */}
          <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative mx-auto mb-6">
              <div className="w-80 h-60 bg-gradient-to-b from-card/80 to-card/40 rounded-2xl border border-border p-3 backdrop-blur-sm shadow-elegant">
                <div className="w-full h-full bg-acode-darker rounded-xl p-4 relative overflow-hidden">
                  {/* Tablet Screenshot Mockup */}
                  <div className="flex">
                    <div className="w-1/4 border-r border-border pr-2">
                      <div className="text-xs text-muted-foreground mb-2">Files</div>
                      <div className="space-y-1 text-xs">
                        <div className="text-blue-400">📁 src</div>
                        <div className="text-white pl-2">📄 App.js</div>
                        <div className="text-white pl-2">📄 index.js</div>
                        <div className="text-blue-400">📁 public</div>
                      </div>
                    </div>
                    <div className="flex-1 pl-3">
                      <div className="text-xs font-mono text-green-400 mb-2">App.js</div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="text-blue-400">import React from 'react';</div>
                        <div className="text-purple-400">const App = () =&gt; {"{"}</div>
                        <div className="text-white pl-2">return (</div>
                        <div className="text-yellow-400 pl-4">&lt;div className="app"&gt;</div>
                        <div className="text-white pl-6">Welcome to Acode</div>
                        <div className="text-yellow-400 pl-4">&lt;/div&gt;</div>
                        <div className="text-white pl-2">);</div>
                        <div className="text-purple-400">{"}"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Tablet className="w-5 h-5" />
              <span>Tablet</span>
            </div>
          </div>

          {/* Desktop View */}
          <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative mx-auto mb-6">
              <div className="w-80 h-48 bg-gradient-to-b from-card/80 to-card/40 rounded-xl border border-border p-2 backdrop-blur-sm shadow-elegant">
                <div className="w-full h-full bg-acode-darker rounded-lg p-3 relative overflow-hidden">
                  {/* Desktop Screenshot Mockup */}
                  <div className="flex">
                    <div className="w-1/5 border-r border-border pr-1">
                      <div className="text-xs text-muted-foreground mb-1">Explorer</div>
                      <div className="space-y-1 text-xs">
                        <div className="text-blue-400">📁 components</div>
                        <div className="text-blue-400">📁 pages</div>
                        <div className="text-white">📄 App.js</div>
                        <div className="text-white">📄 index.js</div>
                      </div>
                    </div>
                    <div className="flex-1 pl-2">
                      <div className="flex space-x-2 mb-1">
                        <div className="bg-secondary/50 px-2 py-1 rounded text-xs">App.js</div>
                        <div className="bg-secondary/30 px-2 py-1 rounded text-xs">index.js</div>
                      </div>
                      <div className="space-y-1 text-xs font-mono">
                        <div><span className="text-gray-500">1</span> <span className="text-blue-400">import</span> <span className="text-yellow-400">'./App.css'</span></div>
                        <div><span className="text-gray-500">2</span></div>
                        <div><span className="text-gray-500">3</span> <span className="text-purple-400">function</span> <span className="text-blue-300">App</span>() {"{"}</div>
                        <div><span className="text-gray-500">4</span>   <span className="text-purple-400">return</span> (</div>
                        <div><span className="text-gray-500">5</span>     <span className="text-yellow-400">&lt;div</span> <span className="text-blue-300">className</span>=<span className="text-green-400">"App"</span><span className="text-yellow-400">&gt;</span></div>
                        <div><span className="text-gray-500">6</span>       <span className="text-white">Coding on mobile!</span></div>
                      </div>
                    </div>
                    <div className="w-1/4 border-l border-border pl-1">
                      <div className="text-xs text-muted-foreground mb-1">Plugins</div>
                      <div className="space-y-1 text-xs">
                        <div className="text-green-400">✓ Git Manager</div>
                        <div className="text-green-400">✓ AI Assistant</div>
                        <div className="text-blue-400">⚡ Live Preview</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Monitor className="w-5 h-5" />
              <span>Desktop</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              📱
            </div>
            <h3 className="font-semibold mb-2">Touch Optimized</h3>
            <p className="text-sm text-muted-foreground">Gestures and touch controls designed for mobile coding</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              🎨
            </div>
            <h3 className="font-semibold mb-2">Adaptive UI</h3>
            <p className="text-sm text-muted-foreground">Interface automatically adjusts to your screen size</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              ⚡
            </div>
            <h3 className="font-semibold mb-2">Fast Performance</h3>
            <p className="text-sm text-muted-foreground">Optimized for mobile devices without compromising speed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              🔧
            </div>
            <h3 className="font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-muted-foreground">Personalize every aspect of your coding environment</p>
          </div>
        </div>
      </div>
    </section>
  )
}