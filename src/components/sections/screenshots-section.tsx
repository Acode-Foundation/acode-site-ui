import { Smartphone, Monitor, Tablet } from "lucide-react"

export function ScreenshotsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Beautiful on
            <span className="bg-gradient-primary bg-clip-text text-transparent"> every device</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience seamless coding across all your devices with our responsive design and adaptive interface.
          </p>
        </div>

        {/* Device Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Mobile View */}
          <div className="text-center animate-slide-up">
            <div className="relative mx-auto mb-6">
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Mobile coding interface"
                className="w-64 h-96 object-cover rounded-3xl border border-border/50 shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent rounded-3xl" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                  Mobile Editor
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
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Tablet coding interface"
                className="w-80 h-60 object-cover rounded-2xl border border-border/50 shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent rounded-2xl" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                  Tablet Interface
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
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Desktop coding interface"
                className="w-80 h-48 object-cover rounded-xl border border-border/50 shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent rounded-xl" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                  Desktop Environment
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