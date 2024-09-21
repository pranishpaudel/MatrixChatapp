import { Paperclip, Download } from "lucide-react";

interface MessageAttachmentsProps {
  fileName: string;
  fileType: string;
  isUser: boolean;
}

const MessageAttachments = ({
  fileName,
  fileType,
  isUser,
}: MessageAttachmentsProps) => {
  return (
    <div className="flex justify-evenly gap-2">
      <span>
        <Paperclip className={`${isUser ? "" : "text-purple-600"}`} />
      </span>
      <span> {fileName}</span>
      <span>
        <Download className={`${isUser ? "" : "text-purple-600"}`} />
      </span>
    </div>
  );
};
export default MessageAttachments;
