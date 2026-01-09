import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, AtSign, Paperclip, Smile, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  getProcessComments,
  createComment,
  replyToComment,
  getMentionSuggestions,
  Comment as APIComment,
} from '@/services/commentsService';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  text: string;
  timestamp: Date;
  mentions?: string[];
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  replies?: Comment[];
}

interface ProcessCommentsProps {
  processId: string;
  comments?: Comment[];
  onAddComment?: (comment: { text: string; mentions?: string[] }) => void;
}

const ProcessComments: React.FC<ProcessCommentsProps> = ({
  processId,
  comments: initialComments,
  onAddComment
}) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Converter comentários da API para o formato do componente
  const convertAPIComments = (apiComments: APIComment[]): Comment[] => {
    return apiComments.map(comment => ({
      id: comment.id.toString(),
      user: {
        id: comment.created_by.toString(),
        name: comment.created_by_name,
        role: comment.created_by_role || 'Usuário',
      },
      text: comment.text,
      timestamp: new Date(comment.created_at),
      mentions: comment.mentions,
      attachments: comment.attachments.map(att => ({
        name: att.file_name,
        url: '', // URL seria gerada pelo backend
        type: att.mime_type || 'application/octet-stream',
      })),
      replies: comment.replies ? convertAPIComments(comment.replies) : undefined,
    }));
  };

  // Carregar comentários do backend
  const loadComments = async () => {
    try {
      setIsLoading(true);
      const apiComments = await getProcessComments(processId, true, 100);
      const convertedComments = convertAPIComments(apiComments);
      setComments(convertedComments.length > 0 ? convertedComments : initialComments || []);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      // Usar comentários iniciais como fallback
      setComments(initialComments || []);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar comentários na montagem
  useEffect(() => {
    if (processId) {
      loadComments();
    }
  }, [processId]);

  // Carregar sugestões de usuários para @mention
  useEffect(() => {
    if (mentionQuery.length > 0) {
      const loadMentionSuggestions = async () => {
        try {
          const suggestions = await getMentionSuggestions(mentionQuery);
          setAvailableUsers(suggestions.map(user => ({
            id: user.id.toString(),
            name: user.name,
            role: user.role || 'Usuário',
          })));
        } catch (error) {
          console.error('Erro ao carregar sugestões:', error);
          // Fallback para lista vazia
          setAvailableUsers([]);
        }
      };
      loadMentionSuggestions();
    } else {
      setAvailableUsers([]);
    }
  }, [mentionQuery]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Comentário vazio",
        description: "Por favor, digite um comentário antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    // Extract mentions from comment text (IDs de usuários)
    const mentionRegex = /@(\w+)/g;
    const mentionNames: string[] = [];
    let match;
    while ((match = mentionRegex.exec(newComment)) !== null) {
      mentionNames.push(match[1]);
    }

    // Converter nomes de menção para IDs (usar availableUsers)
    const mentionIds = mentionNames
      .map(name => availableUsers.find(u => u.name.toLowerCase().includes(name.toLowerCase())))
      .filter(Boolean)
      .map(u => parseInt(u!.id));

    try {
      const apiComment = await createComment(processId, {
        text: newComment,
        mentions: mentionIds.length > 0 ? mentionIds : undefined,
      });

      const convertedComment = convertAPIComments([apiComment])[0];
      setComments(prev => [...prev, convertedComment]);
      setNewComment('');

      if (onAddComment) {
        onAddComment({ text: convertedComment.text, mentions: convertedComment.mentions });
      }

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado ao processo.",
      });
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, digite uma resposta antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const apiReply = await replyToComment(parseInt(parentCommentId), replyText);
      const convertedReply = convertAPIComments([apiReply])[0];
      
      // Atualizar comentário pai com a nova resposta
      setComments(prev => prev.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), convertedReply],
          };
        }
        return comment;
      }));

      setReplyText('');
      setReplyingTo(null);

      toast({
        title: "Resposta adicionada",
        description: "Sua resposta foi adicionada ao comentário.",
      });
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a resposta.",
        variant: "destructive",
      });
    }
  };

  const handleMention = (userName: string) => {
    const textBeforeCursor = newComment.substring(0, newComment.length);
    const textAfterCursor = '';
    setNewComment(`${textBeforeCursor}@${userName} ${textAfterCursor}`);
    setShowMentionSuggestions(false);
    setMentionQuery('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mention
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const query = value.substring(atIndex + 1).split(' ')[0];
      if (query.length > 0) {
        setMentionQuery(query);
        setShowMentionSuggestions(true);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const filteredUsers = availableUsers;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-[#7E69AB]" />
            <span className="ml-2">Carregando comentários...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={cn("flex items-center gap-2", isDark && "text-gray-100")}>
              <MessageSquare className="h-5 w-5 text-[#7E69AB]" />
              Comentários e Colaboração
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadComments}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Comments List */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto custom-scrollbar">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum comentário ainda</p>
                <p className="text-sm mt-1">Seja o primeiro a comentar!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#7E69AB] text-white">
                        {getInitials(comment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
                          {comment.user.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {comment.user.role}
                        </Badge>
                        <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                          {format(comment.timestamp, 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <p className={cn("text-sm whitespace-pre-wrap", isDark ? "text-gray-300" : "text-gray-700")}>
                        {comment.text.split(' ').map((word, i) => {
                          if (word.startsWith('@')) {
                            return (
                              <span key={i} className="text-[#7E69AB] font-medium">
                                {word}{' '}
                              </span>
                            );
                          }
                          return word + ' ';
                        })}
                      </p>
                      {comment.mentions && comment.mentions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <AtSign className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Mencionado: {comment.mentions.join(', ')}
                          </span>
                        </div>
                      )}
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {comment.attachments.map((attachment, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-gray-500"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-8 space-y-3 border-l-2 border-gray-300 pl-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={cn(
                                "p-3 rounded-lg",
                                isDark ? "bg-gray-800" : "bg-gray-100"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn("text-xs font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                                  {reply.user.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {reply.user.role}
                                </Badge>
                                <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                                  {format(reply.timestamp, 'dd/MM/yyyy HH:mm')}
                                </span>
                              </div>
                              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
                                {reply.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Button */}
                      <div className="mt-2">
                        {replyingTo === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Digite sua resposta..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                              className={cn(
                                isDark && "bg-gray-700 border-gray-600 text-gray-100"
                              )}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleReply(comment.id)}
                                className="bg-[#7E69AB] hover:bg-[#6a5590]"
                                disabled={!replyText.trim()}
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Enviar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-xs"
                          >
                            Responder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                placeholder="Adicione um comentário... Use @ para mencionar alguém"
                value={newComment}
                onChange={handleTextChange}
                rows={3}
                className={cn(
                  "pr-10",
                  isDark && "bg-gray-700 border-gray-600 text-gray-100"
                )}
              />
              
              {/* Mention Suggestions */}
              {showMentionSuggestions && filteredUsers.length > 0 && (
                <div className={cn(
                  "absolute bottom-full left-0 mb-2 w-full bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto",
                  isDark && "bg-gray-800 border-gray-700"
                )}>
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleMention(user.name)}
                      className={cn(
                        "w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2",
                        isDark && "hover:bg-gray-700"
                      )}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-[#7E69AB] text-white text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={cn("text-sm font-medium", isDark && "text-gray-200")}>
                          {user.name}
                        </p>
                        <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                          {user.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Dica: Use @ para mencionar usuários</span>
              </div>
              <Button
                onClick={handleAddComment}
                className="bg-[#7E69AB] hover:bg-[#6a5590]"
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessComments;

