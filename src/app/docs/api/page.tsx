import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// A more robust markdown-to-HTML converter
function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (e.g., ```json ... ```)
  html = html.replace(
    /```(json|bash)?\n([\s\S]*?)```/g,
    (match, lang, code) =>
      `<pre class="bg-muted p-4 rounded-md text-sm my-4 overflow-x-auto"><code>${code.trim()}</code></pre>`
  );

  // Headings (e.g., #, ##, ###)
  html = html.replace(/^### (.*$)/g, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>');
  html = html.replace(/^## (.*$)/g, '<h2 class="text-2xl font-bold mb-3 mt-5 border-b pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/g, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>');
  
  // Tables
  html = html.replace(/^\|(.+)\|(.+)\|(.+)\|(.+)\|/gm, '<tr><td class="border px-4 py-2">$1</td><td class="border px-4 py-2">$2</td><td class="border px-4 py-2">$3</td><td class="border px-4 py-2">$4</td></tr>');
  html = html.replace(/(<tr>.+<\/tr>)/g, '<tbody>$1</tbody>');
  html = html.replace(/:---/g, ''); // clean up separators
  html = html.replace(/<\/tbody>\s*<tbody>/g, ''); // merge consecutive tbody
  html = html.replace(/<tbody>/g, '<table class="table-auto w-full my-4 border-collapse"><thead></thead><tbody>');
  html = html.replace(/<\/tbody>/g, '</tbody></table>');


  // Bold text (e.g., **text**)
  html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');

  // Inline code (e.g., `code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted text-foreground font-mono text-sm px-1 py-0.5 rounded">$1</code>');

  // Paragraphs (handles line breaks)
  html = html.split(/\n\n+/).map(p => {
      if (p.startsWith('<') || p.trim() === '') return p;
      return `<p class="my-4">${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('');
  
  // Clean up stray <br/> tags around block elements
  html = html.replace(/<br\/>\s*(<(h[1-3]|pre|table|p))/g, '$1');
  html = html.replace(/(<\/(h[1-3]|pre|table|p)>)\s*<br\/>/g, '$1');


  return html;
}


export default async function ApiDocsPage() {
    const filePath = path.join(process.cwd(), 'docs', 'api.md');
    let content = '';

    try {
        content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error('Could not read API documentation file:', error);
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error Loading Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The API documentation file could not be found or read. Please ensure `docs/api.md` exists.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const htmlContent = markdownToHtml(content);

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto py-10 px-4 md:px-6">
                <div 
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />
            </div>
        </div>
    );
}
