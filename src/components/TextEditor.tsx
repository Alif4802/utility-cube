import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Download, Upload, Save, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const TextEditor = () => {
  const [content, setContent] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = "";
    
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }
    }, 0);
  };

  const handleAlignment = (alignment: string) => {
    if (!textareaRef.current) return;
    
    const lines = content.split('\n');
    const currentLineIndex = content.substring(0, textareaRef.current.selectionStart).split('\n').length - 1;
    
    let prefix = "";
    switch (alignment) {
      case "center":
        prefix = "<center>";
        lines[currentLineIndex] = `<center>${lines[currentLineIndex]}</center>`;
        break;
      case "right":
        prefix = "<div align='right'>";
        lines[currentLineIndex] = `<div align='right'>${lines[currentLineIndex]}</div>`;
        break;
      case "left":
      default:
        // Remove any existing alignment
        lines[currentLineIndex] = lines[currentLineIndex]
          .replace(/<center>|<\/center>/g, '')
          .replace(/<div align='right'>|<\/div>/g, '');
        break;
    }
    
    setContent(lines.join('\n'));
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "document.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Complete",
      description: "Your document has been downloaded",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    });
  };

  const clearText = () => {
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Card className="utility-card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Text Editor</h2>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("bold")}
          title="Bold (Markdown: **text**)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("italic")}
          title="Italic (Markdown: *text*)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-border mx-2"></div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleAlignment("left")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleAlignment("center")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleAlignment("right")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-border mx-2"></div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadText}
          title="Download as text file"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearText}
          title="Clear all text"
        >
          Clear
        </Button>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="text-editor" className="block text-sm font-medium text-muted-foreground">
          Document Content
        </label>
        <Textarea
          id="text-editor"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setSelection({ start: target.selectionStart, end: target.selectionEnd });
          }}
          className="min-h-[400px] p-4 font-mono text-sm resize-none"
          placeholder="Start typing your document here...

You can use:
- **bold text** for bold formatting
- *italic text* for italic formatting
- Select text and use the toolbar buttons above"
        />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Characters: {content.length} | Words: {content.split(/\s+/).filter(w => w.length > 0).length}
      </div>
    </Card>
  );
};