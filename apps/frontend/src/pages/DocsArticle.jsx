import { useParams, Navigate, Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { getArticleBySlug } from '../data/docsContent';

// A very basic markdown-to-HTML converter for trusted content
const parseMarkdown = (text) => {
  if (!text) return '';
  
  let html = text;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
  
  // Fix consecutive list items
  html = html.replace(/<\/ul>\n<ul>/g, '\n');
  html = html.replace(/<\/ol>\n<ol>/g, '\n');
  
  // Paragraphs (lines that don't start with a tag)
  html = html.replace(/^(?!<h|<ul|<ol|<li)(.*$)/gim, (match) => {
    return match.trim() ? `<p>${match}</p>` : '';
  });
  
  return html;
};

export default function DocsArticle() {
  const { category, slug } = useParams();
  
  const article = getArticleBySlug(category, slug);
  
  if (!article) {
    return <Navigate to="/docs" replace />;
  }

  const htmlContent = parseMarkdown(article.content);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 md:py-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 font-medium">
        <Link to="/docs" className="hover:text-primary transition">Docs</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-zinc-400">{article.categoryTitle}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary truncate">{article.title}</span>
      </div>

      {/* Article Content */}
      <article className="prose prose-invert prose-zinc max-w-none">
        <div 
          className="docs-content text-zinc-300 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* Article Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <FileText className="w-4 h-4" />
          Terakhir diperbarui: Hari ini
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Apakah artikel ini membantu?</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-zinc-900 hover:bg-primary/20 hover:text-primary text-zinc-400 rounded-md border border-zinc-800 text-sm font-bold transition">Ya</button>
            <button className="px-3 py-1.5 bg-zinc-900 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 rounded-md border border-zinc-800 text-sm font-bold transition">Tidak</button>
          </div>
        </div>
      </div>
    </div>
  );
}
