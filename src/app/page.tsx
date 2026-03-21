'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Send, 
  Code2, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Bot, 
  User,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Moon,
  Sun,
  FileCode,
  Upload,
  FolderOpen,
  ChevronDown,
  X,
  Lightbulb,
  ArrowRight,
  FileArchive,
  Network,
  AlertCircle,
  TrendingUp,
  Brain,
  MessageSquare
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Modelos disponíveis
const AVAILABLE_MODELS = [
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', tier: 'Econômico', color: 'bg-emerald-500', tokens: '~2K', description: 'Bugs simples, boilerplate' },
  { id: 'gemini-3.1-pro-low', name: 'Gemini 3.1 Pro Low', tier: 'Econômico', color: 'bg-emerald-600', tokens: '~5K', description: 'Refatorações médias' },
  { id: 'gemini-3.1-pro-high', name: 'Gemini 3.1 Pro High', tier: 'Médio', color: 'bg-amber-500', tokens: '~10K', description: 'Arquitetura, integrações' },
  { id: 'gpt-oss-120b', name: 'GPT-OSS 120b', tier: 'Médio', color: 'bg-amber-600', tokens: '~12K', description: 'Código legado, docs' },
  { id: 'claude-sonnet-4.6-thinking', name: 'Claude Sonnet 4.6', tier: 'Premium', color: 'bg-purple-500', tokens: '~20K', description: 'Debug complexo, ML' },
  { id: 'claude-opus-4.6-thinking', name: 'Claude Opus 4.6', tier: 'Premium', color: 'bg-purple-700', tokens: '~40K', description: 'Decisões críticas' },
]

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  modelRecommendation?: any
  tokenEstimate?: number
  timestamp: number
}

interface CodeFile {
  name: string
  language: string
  content: string
}

interface AnalysisResult {
  success: boolean
  projectName: string
  stats: {
    totalFiles: number
    totalLines: number
    avgLinesPerFile: number
    detectedPatterns: string[]
    criticalIssues: number
    highIssues: number
    mediumIssues: number
    lowIssues: number
  }
  issues: Array<{
    file: string
    line: number
    name: string
    severity: string
    count: number
  }>
  architecture: {
    nodes: any[]
    edges: any[]
    patterns: string[]
  }
  qualityScore: number
  recommendedModel: string
}

export default function ArchitectAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([])
  const [darkMode, setDarkMode] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'architecture'>('chat')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Sincronizar dark mode com o documento
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Copiar mensagem
  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Enviar mensagem
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const codeContent = codeFiles.length > 0 
        ? codeFiles.map(f => `// ${f.name}\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join('\n\n')
        : undefined

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId,
          code: codeContent,
          codeLanguage: codeFiles[0]?.language
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.message,
          modelRecommendation: data.modelRecommendation,
          tokenEstimate: data.tokenEstimate,
          timestamp: Date.now()
        }

        setMessages(prev => [...prev, assistantMessage])
        setConversationId(data.conversationId)
      } else {
        throw new Error(data.error || 'Erro ao processar mensagem')
      }
    } catch (error: unknown) {
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: `❌ **Erro:** ${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nPor favor, tente novamente.`,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, conversationId, codeFiles])

  // Upload de arquivo individual
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const extension = file.name.split('.').pop() || 'txt'
      
      const languageMap: Record<string, string> = {
        ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
        py: 'python', rs: 'rust', go: 'go', java: 'java', cs: 'csharp',
        rb: 'ruby', php: 'php', swift: 'swift', kt: 'kotlin',
      }

      setCodeFiles(prev => [...prev, {
        name: file.name,
        language: languageMap[extension] || extension,
        content
      }])
    }
    reader.readAsText(file)
  }

  // Upload de ZIP
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    setActiveTab('analyze')

    try {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('projectName', file.name.replace('.zip', ''))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setAnalysisResult(result)
        
        // Adicionar mensagem ao chat
        const analysisMessage: Message = {
          id: `analysis_${Date.now()}`,
          role: 'assistant',
          content: generateAnalysisSummary(result),
          modelRecommendation: AVAILABLE_MODELS.find(m => m.id === result.recommendedModel),
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, analysisMessage])
      } else {
        throw new Error(result.error || 'Erro na análise')
      }
    } catch (error: unknown) {
      console.error('Erro:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Gerar resumo da análise
  const generateAnalysisSummary = (result: AnalysisResult): string => {
    const { stats, qualityScore, recommendedModel } = result
    
    return `## 📊 Análise Concluída

### Estatísticas do Projeto
- **Total de Arquivos:** ${stats.totalFiles}
- **Total de Linhas:** ${stats.totalLines.toLocaleString()}
- **Média de Linhas/Arquivo:** ${stats.avgLinesPerFile}

### 🔍 Problemas Detectados
| Severidade | Quantidade |
|------------|------------|
| 🔴 Crítico | ${stats.criticalIssues} |
| 🟠 Alto | ${stats.highIssues} |
| 🟡 Médio | ${stats.mediumIssues} |
| 🟢 Baixo | ${stats.lowIssues} |

### 📈 Score de Qualidade: **${qualityScore}/100**

### 🏗️ Padrões Detectados
${stats.detectedPatterns.map(p => `- ${p}`).join('\n')}

### 🤖 Modelo Recomendado: **${recommendedModel}**

${qualityScore < 70 ? '⚠️ **Atenção:** Este projeto precisa de melhorias significativas. Recomendo revisar os problemas críticos primeiro.' : '✅ O projeto está em bom estado geral. As melhorias sugeridas são opcionais.'}
`
  }

  // Limpar conversa
  const clearConversation = () => {
    setMessages([])
    setConversationId(null)
    setCodeFiles([])
    setAnalysisResult(null)
  }

  // Quick prompts
  const quickPrompts = [
    { icon: <AlertTriangle className="w-4 h-4" />, text: "Identificar bugs críticos", prompt: "Analise este código e identifique bugs críticos que podem causar falhas em produção" },
    { icon: <Zap className="w-4 h-4" />, text: "Otimizar performance", prompt: "Analise este código e sugira otimizações de performance" },
    { icon: <Lightbulb className="w-4 h-4" />, text: "Sugerir arquitetura", prompt: "Analise este código e sugira melhorias arquiteturais" },
    { icon: <Code2 className="w-4 h-4" />, text: "Refatorar código", prompt: "Analise este código e sugira refatorações para melhor legibilidade" },
  ]

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const zipFile = files.find(f => f.name.endsWith('.zip'))
    
    if (zipFile) {
      const event = { target: { files: [zipFile] } } as unknown as React.ChangeEvent<HTMLInputElement>
      handleZipUpload(event)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-card/80 backdrop-blur-sm border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              ArchitectAI
            </h1>
            <p className="text-xs text-muted-foreground">
              Arquiteto de Software Senior
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex rounded-lg p-1 bg-muted">
            {(['chat', 'analyze'] as const).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab ? 'bg-accent text-accent-foreground shadow-sm' : ''} capitalize`}
              >
                {tab === 'chat' ? <MessageSquare className="w-4 h-4 mr-1" /> : <Network className="w-4 h-4 mr-1" />}
                {tab}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-muted-foreground hover:text-foreground"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearConversation}
            className="text-muted-foreground hover:text-red-400"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Welcome Message */}
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
                        <Bot className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Olá! Sou o ArchitectAI</h2>
                      <p className="max-w-lg mx-auto mb-6 text-muted-foreground">
                        Sou seu Arquiteto de Software Senior. Cole seu código, descreva o problema 
                        e eu vou analisar, identificar problemas e recomendar o modelo de IA mais 
                        eficiente em tokens para resolver.
                      </p>

                      {/* Upload ZIP Area */}
                      <div 
                        className={`max-w-md mx-auto mb-8 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all
                          ${dragActive 
                            ? 'border-violet-500 bg-violet-500/10' 
                            : 'border-border hover:border-violet-500/50 hover:bg-accent/50'
                          }`}
                        onClick={() => zipInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={zipInputRef}
                          onChange={handleZipUpload}
                          className="hidden"
                          accept=".zip"
                        />
                        <FileArchive className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="font-medium text-foreground">
                          Arraste um arquivo ZIP ou clique para fazer upload
                        </p>
                        <p className="text-sm mt-1 text-muted-foreground">
                          Analisarei toda a arquitetura do projeto
                        </p>
                      </div>

                      {/* Quick Prompts */}
                      <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
                        {quickPrompts.map((qp, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="justify-start h-auto py-3 px-4 bg-card/50 border-border hover:bg-accent"
                            onClick={() => setInput(qp.prompt)}
                          >
                            <span className="text-violet-400">{qp.icon}</span>
                            <span className="ml-2 text-sm">{qp.text}</span>
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Messages List */}
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                          <Card className={`${msg.role === 'user' 
                            ? 'bg-violet-600 border-violet-500' 
                            : 'bg-card border-border'
                          }`}>
                            <CardContent className="p-4">
                              {/* Model Recommendation Badge */}
                              {msg.modelRecommendation && (
                                <div className="mb-3 flex items-center gap-2">
                                  <Badge className={`${msg.modelRecommendation.color} text-white`}>
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {msg.modelRecommendation.name}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {msg.modelRecommendation.tier} - {msg.modelRecommendation.description}
                                  </span>
                                </div>
                              )}

                              {/* Message Content */}
                              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'text-white prose-invert' : 'prose-invert'}`}>
                                <ReactMarkdown
                                  components={{
                                    code({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
                                      const match = /language-(\w+)/.exec(className || '')
                                      return match ? (
                                        <div className="relative group my-4">
                                          <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-t-md flex items-center justify-between">
                                            <span>{match[1]}</span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2 text-xs"
                                              onClick={() => copyToClipboard(String(children).replace(/\n$/, ''), `${msg.id}_code`)}
                                            >
                                              {copiedId === `${msg.id}_code` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                          </div>
                                          <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-t-none"
                                            {...props}
                                          >
                                            {String(children).replace(/\n$/, '')}
                                          </SyntaxHighlighter>
                                        </div>
                                      ) : (
                                        <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm`} {...props}>
                                          {children}
                                        </code>
                                      )
                                    },
                                    h2({ children }) {
                                      return <h2 className="text-lg font-bold mt-6 mb-3 flex items-center gap-2 text-foreground">{children}</h2>
                                    },
                                    h3({ children }) {
                                      return <h3 className="text-md font-semibold mt-4 mb-2 text-foreground">{children}</h3>
                                    },
                                    ul({ children }) {
                                      return <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                                    },
                                    table({ children }) {
                                      return <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse">{children}</table></div>
                                    },
                                    th({ children }) {
                                      return <th className="border px-3 py-2 text-left bg-muted border-border">{children}</th>
                                    },
                                    td({ children }) {
                                      return <td className="border px-3 py-2 border-border">{children}</td>
                                    },
                                    p({ children }) {
                                      return <p className="my-2 text-foreground/80">{children}</p>
                                    },
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>

                              {/* Token Estimate */}
                              {msg.tokenEstimate && (
                                <div className="mt-3 pt-3 border-t text-xs border-border text-muted-foreground">
                                  Estimativa: ~{msg.tokenEstimate} tokens
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Copy Button */}
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(msg.content, msg.id)}
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                              Copiar
                            </Button>
                          </div>
                        </div>

                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <Card className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                            <span className="text-muted-foreground">Analisando código...</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 bg-card/80 border-border">
                <div className="max-w-4xl mx-auto">
                  {/* Code Files */}
                  {codeFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {codeFiles.map((file, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-muted text-foreground px-3 py-1"
                        >
                          <FileCode className="w-3 h-3 mr-1" />
                          {file.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-2"
                            onClick={() => setCodeFiles(prev => prev.filter((_, idx) => idx !== i))}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".ts,.tsx,.js,.jsx,.py,.rs,.go,.java,.cs,.rb,.php,.swift,.kt,.json,.yaml,.yml,.md"
                    />
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-card border-border hover:bg-accent"
                      title="Upload arquivo de código"
                    >
                      <FileCode className="w-5 h-5" />
                    </Button>

                    <div className="flex-1 relative">
                      <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        placeholder="Cole seu código ou descreva o problema..."
                        className="min-h-[52px] max-h-[200px] resize-none bg-card border-border focus:border-violet-500"
                      />
                    </div>

                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-4"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <p className="text-xs mt-2 text-center text-muted-foreground">
                    Pressione Enter para enviar • Shift+Enter para nova linha • Arraste um ZIP para análise completa
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Analyze Tab */
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-16 h-16 animate-spin text-violet-500 mb-4" />
                    <p className="text-lg text-foreground">
                      Analisando arquitetura do projeto...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Isso pode levar alguns segundos
                    </p>
                  </div>
                ) : analysisResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Quality Score Card */}
                    <Card className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold">Score de Qualidade</h3>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.projectName}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-5xl font-bold ${
                              analysisResult.qualityScore >= 80 ? 'text-emerald-500' :
                              analysisResult.qualityScore >= 60 ? 'text-amber-500' :
                              'text-red-500'
                            }`}>
                              {analysisResult.qualityScore}
                            </div>
                            <p className="text-sm text-muted-foreground">/100</p>
                          </div>
                        </div>
                        <Progress value={analysisResult.qualityScore} className="h-3" />
                      </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <Card className="bg-card border-border">
                        <CardContent className="p-4 text-center">
                          <FolderOpen className="w-8 h-8 mx-auto mb-2 text-violet-500" />
                          <div className="text-2xl font-bold">{analysisResult.stats.totalFiles}</div>
                          <p className="text-xs text-muted-foreground">Arquivos</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border-border">
                        <CardContent className="p-4 text-center">
                          <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                          <div className="text-2xl font-bold">{analysisResult.stats.totalLines.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">Linhas</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border-border">
                        <CardContent className="p-4 text-center">
                          <Network className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                          <div className="text-2xl font-bold">{analysisResult.stats.detectedPatterns.length}</div>
                          <p className="text-xs text-muted-foreground">Padrões</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border-border">
                        <CardContent className="p-4 text-center">
                            <Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                            <div className="text-2xl font-bold">{analysisResult.recommendedModel.split('-')[0]}</div>
                            <p className="text-xs text-muted-foreground">Recomendado</p>
                          </CardContent>
                      </Card>
                    </div>

                    {/* Issues */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          Problemas Detectados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 rounded-lg bg-red-500/10">
                            <div className="text-2xl font-bold text-red-500">{analysisResult.stats.criticalIssues}</div>
                            <div className="text-xs text-red-400">Críticos</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-orange-500/10">
                            <div className="text-2xl font-bold text-orange-500">{analysisResult.stats.highIssues}</div>
                            <div className="text-xs text-orange-400">Alto</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-amber-500/10">
                            <div className="text-2xl font-bold text-amber-500">{analysisResult.stats.mediumIssues}</div>
                            <div className="text-xs text-amber-400">Médio</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                            <div className="text-2xl font-bold text-emerald-500">{analysisResult.stats.lowIssues}</div>
                            <div className="text-xs text-emerald-400">Baixo</div>
                          </div>
                        </div>
                        
                        {analysisResult.issues.length > 0 && (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {analysisResult.issues.slice(0, 20).map((issue, i) => (
                              <div 
                                key={i}
                                className="flex items-center gap-3 p-2 rounded bg-muted"
                              >
                                <Badge className={`
                                  ${issue.severity === 'CRÍTICO' ? 'bg-red-500' : ''}
                                  ${issue.severity === 'ALTO' ? 'bg-orange-500' : ''}
                                  ${issue.severity === 'MÉDIO' ? 'bg-amber-500' : ''}
                                  ${issue.severity === 'BAIXO' ? 'bg-emerald-500' : ''}
                                  text-white
                                `}>
                                  {issue.severity}
                                </Badge>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{issue.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {issue.file}:{issue.line}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  x{issue.count}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Detected Patterns */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-violet-500" />
                          Padrões de Arquitetura
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.stats.detectedPatterns.map((pattern) => (
                            <Badge 
                              key={pattern}
                              variant="outline"
                              className="px-3 py-1"
                            >
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Upload className="w-16 h-16 mb-4 text-muted-foreground" />
                    <p className="text-lg mb-2 text-foreground">
                      Faça upload de um arquivo ZIP para análise
                    </p>
                    <p className="text-sm mb-6 text-muted-foreground">
                      Analisarei toda a estrutura do projeto
                    </p>
                    <Button
                      onClick={() => zipInputRef.current?.click()}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      <FileArchive className="w-4 h-4 mr-2" />
                      Selecionar arquivo ZIP
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Models */}
        <aside className="w-72 border-l p-4 hidden lg:block overflow-y-auto bg-card/50 border-border">
          <h3 className="text-sm font-semibold mb-4 text-foreground">
            Modelos Disponíveis
          </h3>
          
          <div className="space-y-3">
            {AVAILABLE_MODELS.map((model) => (
              <Card key={model.id} className="bg-card border-border transition-all hover:scale-[1.02]">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${model.color}`} />
                    <span className="text-sm font-medium">{model.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {model.tier}
                    </Badge>
                    <span className="text-muted-foreground">
                      {model.tokens}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {model.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-lg bg-muted">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
              💡 Como Funciona
            </h4>
            <p className="text-xs text-muted-foreground">
              1. Cole seu código ou faça upload de um ZIP<br/>
              2. Descreva o problema<br/>
              3. Receba análise + recomendação de modelo<br/>
              4. Use o modelo ideal para resolver
            </p>
          </div>
        </aside>
      </div>

      {/* Drag overlay */}
      <AnimatePresence>
        {dragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-violet-500/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="p-8 rounded-xl bg-card shadow-2xl border border-border">
              <FileArchive className="w-16 h-16 mx-auto mb-4 text-violet-500" />
              <p className="text-lg font-medium">Solte o arquivo ZIP aqui</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
