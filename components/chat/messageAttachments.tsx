import { Paperclip, Download } from "lucide-react";

interface MessageAttachmentsProps {
  fileName: string;
  fileUrl: string;
  isUser: boolean;
}

const MessageAttachments = ({
  fileName,
  fileUrl,
  isUser,
}: MessageAttachmentsProps) => {
  return (
    <div className="flex justify-evenly gap-2">
      <span>
        <Paperclip className={`${isUser ? "" : "text-purple-600"}`} />
      </span>
      <span>{fileName}</span>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <Download className={`${isUser ? "" : "text-purple-600"}`} />
      </a>
    </div>
  );
};

export default MessageAttachments;
