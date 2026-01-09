/**
 * Serviço para Comments API
 */
import { apiUrl, apiRequest, apiRequestFile } from '@/config/api';

export interface CommentAttachment {
  id: number;
  file_name: string;
  file_size: number;
  mime_type?: string;
  created_at: string;
}

export interface Comment {
  id: number;
  text: string;
  mentions?: number[];
  created_by: number;
  created_by_name: string;
  created_by_role?: string;
  parent_comment_id?: number;
  attachments: CommentAttachment[];
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CommentCreate {
  text: string;
  mentions?: number[];
  import_process_id?: number;
  export_process_id?: number;
  parent_comment_id?: number;
}

/**
 * Obter comentários de um processo
 */
export const getProcessComments = async (
  processId: string,
  includeReplies: boolean = true,
  limit: number = 100
): Promise<Comment[]> => {
  const params = new URLSearchParams({
    include_replies: includeReplies.toString(),
    limit: limit.toString(),
  });
  const response = await apiRequest(apiUrl(`comments/processes/${processId}/comments?${params}`));
  return response.json();
};

/**
 * Criar comentário
 */
export const createComment = async (
  processId: string,
  comment: CommentCreate,
  files?: File[]
): Promise<Comment> => {
  if (files && files.length > 0) {
    // Upload com arquivos
    const formData = new FormData();
    formData.append('text', comment.text);
    if (comment.mentions) {
      formData.append('mentions', JSON.stringify(comment.mentions));
    }
    if (comment.parent_comment_id) {
      formData.append('parent_comment_id', comment.parent_comment_id.toString());
    }
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiRequestFile(
      apiUrl(`comments/processes/${processId}/comments`),
      formData
    );
    return response.json();
  } else {
    // Upload sem arquivos
    const response = await apiRequest(apiUrl(`comments/processes/${processId}/comments`), {
      method: 'POST',
      body: JSON.stringify(comment),
    });
    return response.json();
  }
};

/**
 * Responder a um comentário
 */
export const replyToComment = async (
  commentId: number,
  text: string,
  mentions?: number[],
  files?: File[]
): Promise<Comment> => {
  if (files && files.length > 0) {
    const formData = new FormData();
    formData.append('text', text);
    if (mentions) {
      formData.append('mentions', JSON.stringify(mentions));
    }
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiRequestFile(
      apiUrl(`comments/comments/${commentId}/reply`),
      formData
    );
    return response.json();
  } else {
    const response = await apiRequest(apiUrl(`comments/comments/${commentId}/reply`), {
      method: 'POST',
      body: JSON.stringify({ text, mentions }),
    });
    return response.json();
  }
};

/**
 * Atualizar comentário
 */
export const updateComment = async (
  commentId: number,
  text: string
): Promise<Comment> => {
  const response = await apiRequest(apiUrl(`comments/comments/${commentId}`), {
    method: 'PATCH',
    body: JSON.stringify({ text }),
  });
  return response.json();
};

/**
 * Deletar comentário
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await apiRequest(apiUrl(`comments/comments/${commentId}`), {
    method: 'DELETE',
  });
};

/**
 * Obter sugestões de usuários para @mention
 */
export const getMentionSuggestions = async (query: string): Promise<Array<{
  id: number;
  name: string;
  email: string;
  role?: string;
}>> => {
  const params = new URLSearchParams({ q: query });
  const response = await apiRequest(apiUrl(`comments/users/mention-suggestions?${params}`));
  return response.json();
};

