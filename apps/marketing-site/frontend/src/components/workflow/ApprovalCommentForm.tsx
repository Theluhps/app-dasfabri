
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface ApprovalCommentFormProps {
  onSubmit: (comment: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
}

const ApprovalCommentForm: React.FC<ApprovalCommentFormProps> = ({
  onSubmit,
  isSubmitting = false,
  placeholder = "Adicione um comentário à sua decisão..."
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-start gap-2">
        <MessageSquare className="h-5 w-5 text-gray-400 mt-2" />
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] flex-1"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!comment.trim() || isSubmitting}
          size="sm"
        >
          Adicionar Comentário
        </Button>
      </div>
    </form>
  );
};

export default ApprovalCommentForm;
