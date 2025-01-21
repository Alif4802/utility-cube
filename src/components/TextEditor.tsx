import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export const TextEditor = () => {
  const [content, setContent] = useState("");

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <Card className="utility-card max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("underline")}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("justifyLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("justifyCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleFormat("justifyRight")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="min-h-[300px] p-4 border rounded-lg focus:outline-none"
        contentEditable
        onInput={(e) => setContent(e.currentTarget.textContent || "")}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Card>
  );
};