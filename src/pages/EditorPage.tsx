import { TextEditor } from "@/components/TextEditor";

const EditorPage = () => {
  return (
    <div className="min-h-screen pt-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gradient-primary mb-8">Text Editor</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Create and edit documents with our feature-rich text editor.
        </p>
        <TextEditor />
      </div>
    </div>
  );
};

export default EditorPage;