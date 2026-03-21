/**
 * ArchitectAI - API de Análise de Arquitetura
 * Analisa estrutura de código, detecta padrões e gera visualização
 */

import { NextRequest, NextResponse } from 'next/server';

// Padrões de arquitetura conhecidos
const ARCHITECTURE_PATTERNS: Record<string, { patterns: string[]; name: string; color: string; icon: string }> = {
  nextjs: {
    patterns: ['app/', 'pages/', 'api/', 'layout.tsx', 'page.tsx'],
    name: 'Next.js App Router',
    color: '#000000',
    icon: '⚛️'
  },
  react: {
    patterns: ['components/', 'hooks/', 'context/', 'useState', 'useEffect'],
    name: 'React Application',
    color: '#61DAFB',
    icon: '⚛️'
  },
  express: {
    patterns: ['routes/', 'controllers/', 'middleware/', 'express'],
    name: 'Express.js Backend',
    color: '#000000',
    icon: '🚂'
  },
  prisma: {
    patterns: ['prisma/', 'schema.prisma', '@prisma/client'],
    name: 'Prisma ORM',
    color: '#2D3748',
    icon: '🗄️'
  },
  typescript: {
    patterns: ['.ts', '.tsx', 'interface ', 'type ', 'enum '],
    name: 'TypeScript',
    color: '#3178C6',
    icon: '📘'
  },
  tailwind: {
    patterns: ['tailwind', 'className=', 'tw-'],
    name: 'Tailwind CSS',
    color: '#06B6D4',
    icon: '🎨'
  },
  websocket: {
    patterns: ['WebSocket', 'socket.io', 'ws://', 'wss://'],
    name: 'WebSocket',
    color: '#010101',
    icon: '🔌'
  },
  chromeExtension: {
    patterns: ['manifest.json', 'chrome.', 'background.js', 'content.js'],
    name: 'Chrome Extension',
    color: '#4285F4',
    icon: '🧩'
  },
  apiRoutes: {
    patterns: ['/api/', 'route.ts', 'GET', 'POST', 'PUT', 'DELETE'],
    name: 'API Routes',
    color: '#10B981',
    icon: '🛤️'
  },
  database: {
    patterns: ['schema', 'model ', 'migration', 'sql', 'query'],
    name: 'Database Layer',
    color: '#F59E0B',
    icon: '🗃️'
  },
  authentication: {
    patterns: ['auth', 'login', 'session', 'token', 'jwt'],
    name: 'Authentication',
    color: '#EF4444',
    icon: '🔐'
  },
  ml: {
    patterns: ['predict', 'train', 'model', 'ml', 'neural', 'learning'],
    name: 'Machine Learning',
    color: '#8B5CF6',
    icon: '🧠'
  }
};

// Problemas comuns por severidade
const ISSUE_PATTERNS = {
  critical: [
    { pattern: /password\s*=\s*['"][^'"]+['"]/gi, name: 'Senha hardcoded', severity: 'CRÍTICO' },
    { pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/gi, name: 'API Key hardcoded', severity: 'CRÍTICO' },
    { pattern: /secret\s*=\s*['"][^'"]+['"]/gi, name: 'Secret hardcoded', severity: 'CRÍTICO' },
    { pattern: /eval\s*\(/g, name: 'Uso de eval()', severity: 'CRÍTICO' },
    { pattern: /innerHTML\s*=\s*[^;]+\+/g, name: 'Possível XSS', severity: 'CRÍTICO' },
  ],
  high: [
    { pattern: /:\s*any\b/g, name: 'Uso de any (TypeScript)', severity: 'ALTO' },
    { pattern: /console\.log\s*\(/g, name: 'Console.log em produção', severity: 'ALTO' },
    { pattern: /TODO|FIXME|HACK/g, name: 'Código pendente (TODO/FIXME)', severity: 'ALTO' },
    { pattern: /catch\s*\(\s*\w+\s*\)\s*\{\s*\}/g, name: 'Catch vazio', severity: 'ALTO' },
  ],
  medium: [
    { pattern: /var\s+\w+\s*=/g, name: 'Uso de var (use const/let)', severity: 'MÉDIO' },
    { pattern: /==\s*['"]|['"]\s*==/g, name: 'Comparação com == (use ===)', severity: 'MÉDIO' },
    { pattern: /\.then\s*\(/g, name: 'Uso de .then() (prefira async/await)', severity: 'MÉDIO' },
  ],
  low: [
    { pattern: /eslint-disable/g, name: 'ESLint desabilitado', severity: 'BAIXO' },
    { pattern: /@ts-ignore/g, name: '@ts-ignore usado', severity: 'BAIXO' },
  ]
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const projectName = (formData.get('projectName') as string) || 'Projeto';
    
    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum arquivo fornecido'
      }, { status: 400 });
    }

    // Processar arquivos
    const processedFiles: any[] = [];
    const detectedPatterns = new Set<string>();
    const detectedIssues: any[] = [];
    const fileStructure: any = {};
    let totalLines = 0;
    let totalFiles = 0;

    for (const file of files as unknown as File[]) {
      if (!file || typeof file.arrayBuffer !== 'function') continue;
      
      try {
        const buffer = await file.arrayBuffer();
        const content = new TextDecoder().decode(buffer);
        const fileName = file.name || 'unknown';
        
        totalFiles++;
        totalLines += content.split('\n').length;

        // Detectar linguagem
        const extension = fileName.split('.').pop()?.toLowerCase() || 'txt';
        const language = getLanguage(extension);

        // Detectar padrões de arquitetura
        for (const [key, config] of Object.entries(ARCHITECTURE_PATTERNS)) {
          for (const pattern of config.patterns) {
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
              detectedPatterns.add(key);
            }
          }
        }

        // Detectar problemas
        for (const [severity, patterns] of Object.entries(ISSUE_PATTERNS)) {
          for (const { pattern, name } of patterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 0) {
              detectedIssues.push({
                file: fileName,
                line: getLineNumber(content, matches[0]),
                name,
                severity: severity.toUpperCase(),
                count: matches.length
              });
            }
          }
        }

        // Construir estrutura de arquivos
        const pathParts = fileName.split('/');
        let current = fileStructure;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        if (pathParts.length > 0) {
          current[pathParts[pathParts.length - 1]] = {
            language,
            lines: content.split('\n').length,
            size: buffer.byteLength
          };
        }

        processedFiles.push({
          name: fileName,
          language,
          lines: content.split('\n').length,
          size: buffer.byteLength,
          preview: content.substring(0, 2000)
        });

      } catch (e) {
        console.error('Erro ao processar arquivo:', e);
      }
    }

    // Calcular estatísticas
    const stats = {
      totalFiles,
      totalLines,
      avgLinesPerFile: Math.round(totalLines / (totalFiles || 1)),
      detectedPatterns: Array.from(detectedPatterns),
      criticalIssues: detectedIssues.filter(i => i.severity === 'CRÍTICO').length,
      highIssues: detectedIssues.filter(i => i.severity === 'ALTO').length,
      mediumIssues: detectedIssues.filter(i => i.severity === 'MÉDIO').length,
      lowIssues: detectedIssues.filter(i => i.severity === 'BAIXO').length,
    };

    // Calcular score de qualidade (0-100)
    const qualityScore = Math.max(0, 100 - 
      (stats.criticalIssues * 20) - 
      (stats.highIssues * 10) - 
      (stats.mediumIssues * 5) - 
      (stats.lowIssues * 2)
    );

    // Recomendar modelo baseado na complexidade
    let recommendedModel = 'gemini-3-flash';
    const complexityScore = stats.criticalIssues * 3 + stats.highIssues * 2 + stats.mediumIssues;

    if (complexityScore >= 10) {
      recommendedModel = 'claude-opus-4.6-thinking';
    } else if (complexityScore >= 5) {
      recommendedModel = 'claude-sonnet-4.6-thinking';
    } else if (complexityScore >= 2) {
      recommendedModel = 'gemini-3.1-pro-high';
    } else if (complexityScore >= 1) {
      recommendedModel = 'gemini-3.1-pro-low';
    }

    // Gerar visualização da arquitetura
    const architecture = generateArchitectureVisualization(detectedPatterns, fileStructure);

    return NextResponse.json({
      success: true,
      projectName,
      stats,
      issues: detectedIssues.slice(0, 100),
      architecture,
      qualityScore,
      recommendedModel,
      fileStructure,
      processedFiles: processedFiles.slice(0, 50)
    });

  } catch (error: unknown) {
    console.error('[ArchitectAI] Erro na análise:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// Helpers
function getLanguage(extension: string): string {
  const map: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'rs': 'rust',
    'go': 'go',
    'java': 'java',
    'cs': 'csharp',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'sql': 'sql',
    'prisma': 'prisma',
  };
  return map[extension] || 'text';
}

function getLineNumber(content: string, match: string): number {
  const index = content.indexOf(match);
  if (index === -1) return 0;
  return content.substring(0, index).split('\n').length;
}

function generateArchitectureVisualization(patterns: Set<string>, structure: Record<string, unknown>): {
  nodes: Array<{ id: number; type: string; name: string; color: string; icon: string }>;
  edges: Array<{ from: number; to: number }>;
  patterns: string[];
} {
  const nodes: Array<{ id: number; type: string; name: string; color: string; icon: string }> = [];
  const edges: Array<{ from: number; to: number }> = [];
  let nodeId = 0;

  // Adicionar padrões detectados como nós
  for (const pattern of patterns) {
    const config = ARCHITECTURE_PATTERNS[pattern as keyof typeof ARCHITECTURE_PATTERNS];
    if (config) {
      nodes.push({
        id: nodeId++,
        type: pattern,
        name: config.name,
        color: config.color,
        icon: config.icon
      });
    }
  }

  return {
    nodes,
    edges,
    patterns: Array.from(patterns)
  };
}
