import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Download, Globe, Sparkles, Loader2, Image as ImageIcon, Layout, Type, Upload, X, Maximize2, Minimize2, Settings2, Move, ZoomIn, ArrowLeftRight, HelpCircle, Cloud, ChevronRight, Copy, Check } from 'lucide-react';
import { Laptop, Tablet, Mobile } from './components/DeviceFrames';
import { generateSiteDescription } from './services/geminiService';
import { GeneratedContent } from './types';

// Declare htmlToImage as it's loaded via CDN
declare const htmlToImage: any;

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [activeUrl, setActiveUrl] = useState<string>('google.com'); 
  const [customTitle, setCustomTitle] = useState<string>('LOCAL MAG');
  const [logo1, setLogo1] = useState<string | null>(null);
  
  // Visual Editor State - UPDATED DEFAULTS
  const [titleSize, setTitleSize] = useState<number>(180);
  const [deviceScale, setDeviceScale] = useState<number>(1);
  const [deviceYOffset, setDeviceYOffset] = useState<number>(-157); // Updated default
  const [deviceSpacing, setDeviceSpacing] = useState<number>(0.5); // Updated default
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  
  // Modal States
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiContent, setAiContent] = useState<GeneratedContent | null>(null);
  
  // Ref for the container that holds the scaled preview
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref for the actual 1920x1080 content
  const contentRef = useRef<HTMLDivElement>(null);
  // State to track scale factor
  const [scale, setScale] = useState(1);
  
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  // Responsive scaling logic
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current && contentRef.current) {
        // If full screen, use window dimensions, else use container dimensions
        const availableWidth = isFullScreen ? window.innerWidth : containerRef.current.offsetWidth;
        const availableHeight = isFullScreen ? window.innerHeight : (containerRef.current.offsetWidth * 9 / 16);
        
        if (isFullScreen) {
           // Fit 1920x1080 into window
           const scaleW = availableWidth / 1920;
           const scaleH = availableHeight / 1080;
           setScale(Math.min(scaleW, scaleH) * 0.95); // 0.95 for padding
        } else {
           // Fit into container width
           const newScale = availableWidth / 1920;
           setScale(newScale);
        }
      }
    };

    // Initial calc
    updateScale();

    // Observer for resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);

    return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateScale);
    };
  }, [isFullScreen]);

  const handleGenerate = async () => {
    if (!url) return;
    setIsGenerating(true);
    setActiveUrl(url);

    try {
      const content = await generateSiteDescription(url);
      setAiContent(content);
      // Optional: Auto-set title from AI headline
      if (content.headline) setCustomTitle(content.headline.toUpperCase());
    } catch (e) {
      console.error("Failed to generate AI content", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    try {
      const node = contentRef.current;
      
      const dataUrl = await htmlToImage.toPng(node, {
        quality: 1.0,
        backgroundColor: '#000000',
        width: 1920,
        height: 1080,
        style: {
           transform: 'none', 
           transformOrigin: 'top left'
        },
        filter: (node: HTMLElement) => {
          return !node.classList?.contains('exclude-from-export');
        }
      });
      
      const link = document.createElement('a');
      link.download = `mockup-${activeUrl.replace(/\./g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImg: (s: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6 text-yellow-500" />
            <span className="font-bold text-xl tracking-tight text-white">Mockup<span className="text-yellow-500">Gen</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
             <button onClick={() => setIsFaqOpen(true)} className="hover:text-white text-gray-400 transition-colors flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> FAQ
             </button>
             <button onClick={() => setIsDeployOpen(true)} className="hover:text-yellow-400 text-gray-400 transition-colors flex items-center gap-1">
                <Cloud className="w-4 h-4" /> Deploy Guide
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Controls Section */}
        <div className="max-w-6xl mx-auto mb-10 space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-1">
              Thumbnail Generator
            </h1>
            <p className="text-gray-400">Create professional horizontal mockups for YouTube or Portfolios.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10">
            
            {/* Left Col: URL & Basic Info (4 cols) */}
            <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Website URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="example.com"
                    className="block w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-600 transition-all"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !url}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  {isGenerating ? 'Analyzing...' : 'Generate Mockup'}
                </button>
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title Text</label>
                 <div className="relative">
                   <Type className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                   <input
                     type="text"
                     value={customTitle}
                     onChange={(e) => setCustomTitle(e.target.value)}
                     className="block w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                     placeholder="Main Title"
                   />
                 </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Logo</label>
                <div 
                   onClick={() => fileInputRef1.current?.click()}
                   className="h-16 border border-dashed border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group"
                >
                    {logo1 ? (
                       <div className="relative w-full h-full p-2">
                          <img src={logo1} className="w-full h-full object-contain" alt="Logo" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                             <Upload className="w-5 h-5 text-white" />
                          </div>
                       </div>
                    ) : (
                       <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300">
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-sm">Upload Logo</span>
                       </div>
                    )}
                    <input ref={fileInputRef1} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setLogo1)} />
                </div>
              </div>
            </div>

            {/* Right Col: Visual Editors (8 cols) */}
            <div className="lg:col-span-8 pl-0 lg:pl-4">
               <div className="flex items-center gap-2 mb-6">
                 <Settings2 className="w-5 h-5 text-yellow-500" />
                 <h3 className="font-semibold text-white">Visual Settings</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Font Size */}
                  <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><Type className="w-4 h-4" /> Title Size</span>
                        <span className="text-gray-500">{titleSize}px</span>
                     </div>
                     <input 
                       type="range" min="50" max="300" value={titleSize} 
                       onChange={(e) => setTitleSize(Number(e.target.value))}
                       className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>

                  {/* Device Scale */}
                  <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><ZoomIn className="w-4 h-4" /> Device Zoom</span>
                        <span className="text-gray-500">{(deviceScale * 100).toFixed(0)}%</span>
                     </div>
                     <input 
                       type="range" min="0.5" max="1.5" step="0.05" value={deviceScale} 
                       onChange={(e) => setDeviceScale(Number(e.target.value))}
                       className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>

                   {/* Vertical Position */}
                   <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><Move className="w-4 h-4 rotate-90" /> Vertical Pos</span>
                        <span className="text-gray-500">{deviceYOffset}px</span>
                     </div>
                     <input 
                       type="range" min="-400" max="200" step="10" value={deviceYOffset} 
                       onChange={(e) => setDeviceYOffset(Number(e.target.value))}
                       className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>

                  {/* Horizontal Spacing */}
                  <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4" /> Spacing</span>
                        <span className="text-gray-500">{deviceSpacing}x</span>
                     </div>
                     <input 
                       type="range" min="-0.5" max="2" step="0.1" value={deviceSpacing} 
                       onChange={(e) => setDeviceSpacing(Number(e.target.value))}
                       className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>
               </div>
               
               <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isDownloading ? <Loader2 className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
                    Download Mockup
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* PREVIEW AREA */}
        <div className="relative max-w-6xl mx-auto">
          {/* Header for Preview */}
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-gray-300">Live Preview</h2>
             <button 
               onClick={() => setIsFullScreen(!isFullScreen)}
               className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
             >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
             </button>
          </div>

          {/* Render Container - Handles sizing/scaling */}
          <div 
            ref={containerRef}
            className={`
               ${isFullScreen 
                  ? 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4' 
                  : 'w-full aspect-video bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex items-center justify-center'
               }
            `}
          >
             {isFullScreen && (
                <button 
                  onClick={() => setIsFullScreen(false)}
                  className="absolute top-6 right-6 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                   <X className="w-6 h-6" />
                </button>
             )}

             {/* Actual 1920x1080 Content Node */}
             <div 
               style={{
                 width: '1920px',
                 height: '1080px',
                 transform: `scale(${scale})`,
                 transformOrigin: 'center center',
                 flexShrink: 0,
               }}
               className="bg-black relative shadow-2xl overflow-hidden"
             >
               {/* Capture Content Wrapper */}
               <div 
                  ref={contentRef}
                  className="w-full h-full relative bg-gradient-to-br from-[#1a0b2e] via-[#2d0b45] to-[#0f0524] overflow-hidden"
               >
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent"></div>
                  
                  <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                  <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]"></div>

                   {/* Custom Logo Top Left */}
                   {logo1 && (
                     <div className="absolute top-12 left-16 z-20">
                       <img src={logo1} className="h-20 object-contain drop-shadow-xl" alt="Brand" />
                     </div>
                   )}

                   {/* Main Content Area */}
                   <div 
                     className="absolute inset-0 flex flex-col items-center justify-center z-10"
                     style={{ transform: `translateY(${deviceYOffset}px)` }}
                   >
                     {/* Device Cluster */}
                     <div 
                        className="relative flex items-end justify-center"
                        style={{ 
                           transform: `scale(${deviceScale})`,
                           gap: `${deviceSpacing * 100}px` 
                        }}
                     >
                        
                        {/* Tablet - Left */}
                        <div className="relative z-20 transform -rotate-2 translate-y-8 scale-110 origin-bottom-right">
                           <Tablet src={activeUrl} className="drop-shadow-2xl" />
                        </div>

                        {/* Laptop - Center (Main) */}
                        <div className="relative z-30 transform translate-y-0 scale-110">
                           <Laptop src={activeUrl} className="drop-shadow-2xl" />
                        </div>

                         {/* Mobile - Right */}
                         <div className="relative z-40 transform rotate-2 translate-y-12 scale-[1.35] origin-bottom-left">
                           <Mobile src={activeUrl} className="drop-shadow-2xl" />
                        </div>

                     </div>
                   </div>

                   {/* Title Area - Bottom */}
                   <div className="absolute bottom-12 left-0 w-full text-center z-50 px-20">
                      <h1 
                        className="font-poppins font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                        style={{ 
                           fontSize: `${titleSize}px`,
                           filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' 
                        }}
                      >
                        {customTitle}
                      </h1>
                   </div>
               </div>
             </div>
          </div>
          
          <div className="text-center mt-4 text-gray-500 text-sm">
             Preview scaled to fit screen. Downloads in full 1920x1080 HD.
          </div>
        </div>

      </main>

      {/* FAQ MODAL */}
      {isFaqOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <HelpCircle className="text-yellow-500" /> Frequently Asked Questions
                 </h2>
                 <button onClick={() => setIsFaqOpen(false)} className="text-gray-400 hover:text-white p-2">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-white">How does it work?</h3>
                    <p className="text-gray-400">Enter any website URL, and our tool fetches real-time screenshots to generate a high-quality mockup scene automatically.</p>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-white">Why are the screenshots sometimes generic?</h3>
                    <p className="text-gray-400">If the screenshot service cannot access the site (due to firewalls or loading speed), we show a placeholder. Try refreshing or using a different public URL.</p>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-white">Can I use these images for YouTube?</h3>
                    <p className="text-gray-400">Yes! The generated images are 1920x1080 (HD), perfect for YouTube thumbnails, portfolios, or social media posts.</p>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-white">Is it free?</h3>
                    <p className="text-gray-400">Yes, this tool is completely free to use. You can generate unlimited mockups.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* DEPLOY MODAL */}
      {isDeployOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Cloud className="text-yellow-500" /> Deploy to Cloudflare Pages
                 </h2>
                 <button onClick={() => setIsDeployOpen(false)} className="text-gray-400 hover:text-white p-2">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="p-6 space-y-8">
                 
                 <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                       <strong>Note:</strong> We have added a <code>.gitignore</code> file to your project to automatically exclude system folders like <code>node_modules</code> which cause errors during deployment.
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-l-4 border-yellow-500 pl-4">Step 1: Push to GitHub</h3>
                    <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
                       <li>Create a new repository on GitHub.</li>
                       <li>Run the following commands in your project terminal:</li>
                    </ul>
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-800 font-mono text-sm text-gray-300 relative group">
<pre>{`git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`}</pre>
                       <button className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-l-4 border-yellow-500 pl-4">Step 2: Cloudflare Pages</h3>
                    <ol className="list-decimal list-inside text-gray-400 space-y-3 ml-2">
                       <li>Log in to your <strong>Cloudflare Dashboard</strong>.</li>
                       <li>Go to <strong>Workers &amp; Pages</strong> &gt; <strong>Create Application</strong> &gt; <strong>Pages</strong>.</li>
                       <li>Click <strong>Connect to Git</strong> and select your GitHub repository.</li>
                    </ol>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-l-4 border-yellow-500 pl-4">Step 3: Build Settings</h3>
                    <p className="text-gray-400">Use these exact settings during the setup configuration:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-black/40 p-3 rounded border border-gray-800">
                          <span className="text-gray-500 text-xs uppercase block mb-1">Framework Preset</span>
                          <span className="text-white font-mono">Vite</span>
                       </div>
                       <div className="bg-black/40 p-3 rounded border border-gray-800">
                          <span className="text-gray-500 text-xs uppercase block mb-1">Build Command</span>
                          <span className="text-white font-mono">npm run build</span>
                       </div>
                       <div className="bg-black/40 p-3 rounded border border-gray-800">
                          <span className="text-gray-500 text-xs uppercase block mb-1">Output Directory</span>
                          <span className="text-white font-mono">dist</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                       <h4 className="font-bold text-green-400">Success!</h4>
                       <p className="text-green-200/80 text-sm mt-1">
                          Click <strong>Save and Deploy</strong>. Cloudflare will build your site in about 1 minute and give you a live URL (e.g., <code>project.pages.dev</code>).
                       </p>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;
