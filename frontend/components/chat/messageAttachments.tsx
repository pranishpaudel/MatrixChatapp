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
    <div className="flex items-center p-2 border rounded-md shadow-sm bg-black">
      <span className="mr-2">
        <Paperclip className={`${isUser ? "" : "text-purple-600"}`} />
      </span>
      <span className="flex-1 truncate">{fileName}</span>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-blue-500 hover:text-blue-700"
      >
        <Download className={`${isUser ? "" : "text-purple-600"}`} />
      </a>
    </div>
  );
};

export default MessageAttachments;
