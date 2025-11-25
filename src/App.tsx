import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Download, Upload, Wand2, Github, Globe } from 'lucide-react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')

  const generateMockup = async () => {
    if (!apiKey || !prompt) {
      alert('Please enter your Google AI API key and a prompt')
      return
    }

    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const result = await model.generateContent(
        `Create a detailed mockup description for: ${prompt}. Include specific design elements, colors, layout, and components.`
      )
      const response = await result.response
      const text = response.text()
      
      // For demo purposes, we'll show the generated text
      // In a real app, you'd use this with an image generation API
      setGeneratedImage(text)
    } catch (error) {
      console.error('Error generating mockup:', error)
      alert('Error generating mockup. Please check your API key.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Wand2 className="text-blue-400" size={48} />
              <h1 className="text-4xl font-bold text-white">MockupGen AI</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Generate stunning mockups with AI-powered design assistance
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <label className="text-white font-semibold">Google AI API Key:</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google AI API key"
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-gray-400 text-sm">
              Get your API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-4">
            <label className="text-white font-semibold">Describe your mockup:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Modern mobile app for food delivery with dark theme, minimalist design, and smooth animations"
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateMockup}
            disabled={isLoading || !apiKey || !prompt}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>Generate Mockup</span>
              </>
            )}
          </button>

          {/* Result */}
          {generatedImage && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Generated Mockup Description:</h3>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap">{generatedImage}</p>
              </div>
            </div>
          )}

          {/* Deployment Instructions */}
          <div className="deployment-instructions">
            <ol className="list-decimal list-inside text-gray-400 space-y-3 ml-2">
              <li>Log in to your <strong>Cloudflare Dashboard</strong>.</li>
              <li>Go to <strong>Workers &amp; Pages</strong> &gt; <strong>Create Application</strong> &gt; <strong>Pages</strong>.</li>
              <li>Click <strong>Connect to Git</strong> and select your GitHub repository.</li>
            </ol>
          </div>
          
          {/* Footer */}
          <div className="text-center space-y-4 pt-8 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
              <a
                href="https://cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Globe size={20} />
                <span>Powered by Cloudflare</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Built with React, TypeScript, and Google Generative AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App