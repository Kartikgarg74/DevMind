import { ApiService } from './api';

export interface AIAnalysis {
  type: 'code_review' | 'commit_message' | 'bug_detection' | 'performance' | 'security';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestions: string[];
  confidence: number;
}

export interface CommitSuggestion {
  title: string;
  narrative: string;
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';
  confidence: number;
}

export class AIService {
  private static apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Generate commit message suggestions
  static async generateCommitMessage(
    files: string[],
    changes: string,
    projectContext?: string
  ): Promise<CommitSuggestion[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/commit/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          changes,
          project_context: projectContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error generating commit message:', error);
      // Fallback to mock suggestions
      return this.getMockCommitSuggestions(files, changes);
    }
  }

  // Analyze code for issues and improvements
  static async analyzeCode(
    code: string,
    language: string,
    context?: string
  ): Promise<AIAnalysis[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/debug/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis || [];
    } catch (error) {
      console.error('Error analyzing code:', error);
      // Fallback to mock analysis
      return this.getMockCodeAnalysis(code, language);
    }
  }

  // Get project insights and recommendations
  static async getProjectInsights(projectId: string): Promise<{
    productivity: number;
    codeQuality: number;
    recommendations: string[];
    trends: any[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/analytics/project/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting project insights:', error);
      // Fallback to mock insights
      return this.getMockProjectInsights();
    }
  }

  // Get intelligent code suggestions
  static async getCodeSuggestions(
    code: string,
    language: string,
    cursorPosition?: { line: number; column: number }
  ): Promise<{
    suggestions: string[];
    completions: string[];
    refactoring: string[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/ai/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          cursor_position: cursorPosition,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting code suggestions:', error);
      // Fallback to mock suggestions
      return this.getMockCodeSuggestions(code, language);
    }
  }

  // Mock fallback methods
  private static getMockCommitSuggestions(files: string[], changes: string): CommitSuggestion[] {
    const suggestions: CommitSuggestion[] = [
      {
        title: 'feat: implement new feature',
        narrative: 'Added new functionality to improve user experience',
        type: 'feat',
        confidence: 0.85,
      },
      {
        title: 'fix: resolve bug in authentication',
        narrative: 'Fixed authentication issue that was causing login failures',
        type: 'fix',
        confidence: 0.92,
      },
      {
        title: 'refactor: improve code structure',
        narrative: 'Restructured code for better maintainability and performance',
        type: 'refactor',
        confidence: 0.78,
      },
    ];

    return suggestions.filter(s => s.confidence > 0.7);
  }

  private static getMockCodeAnalysis(code: string, language: string): AIAnalysis[] {
    const analysis: AIAnalysis[] = [
      {
        type: 'code_review',
        title: 'Potential Performance Issue',
        description: 'Consider using a more efficient algorithm for this operation',
        severity: 'medium',
        suggestions: [
          'Use a hash map instead of linear search',
          'Consider caching frequently accessed data',
          'Optimize the loop structure',
        ],
        confidence: 0.82,
      },
      {
        type: 'security',
        title: 'Security Vulnerability Detected',
        description: 'Input validation is missing for user-provided data',
        severity: 'high',
        suggestions: [
          'Add input sanitization',
          'Implement proper validation',
          'Use parameterized queries',
        ],
        confidence: 0.95,
      },
    ];

    return analysis.filter(a => a.confidence > 0.7);
  }

  private static getMockProjectInsights() {
    return {
      productivity: 85,
      codeQuality: 78,
      recommendations: [
        'Consider adding more unit tests',
        'Implement code review process',
        'Add automated linting',
        'Optimize database queries',
      ],
      trends: [
        { date: '2024-01-01', commits: 12, quality: 75 },
        { date: '2024-01-02', commits: 8, quality: 80 },
        { date: '2024-01-03', commits: 15, quality: 78 },
      ],
    };
  }

  private static getMockCodeSuggestions(code: string, language: string) {
    return {
      suggestions: [
        'Consider extracting this into a separate function',
        'Add error handling for edge cases',
        'Use constants for magic numbers',
      ],
      completions: [
        'function',
        'const',
        'let',
        'if',
        'for',
      ],
      refactoring: [
        'Extract method',
        'Rename variable',
        'Simplify conditional',
        'Remove unused code',
      ],
    };
  }
}
