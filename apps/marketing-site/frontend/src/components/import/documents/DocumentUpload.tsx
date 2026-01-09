import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle2, AlertCircle, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface DocumentUploadProps {
  onUploadComplete?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  processId?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 50,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx'],
  processId
}) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const simulateUpload = (file: File, fileId: string) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'success' }
              : f
          ));
          resolve();
        } else {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        }
      }, 200);
    });
  };

  const processFiles = useCallback(async (files: File[]) => {
    setIsDragging(false);

    // Validate files
    const acceptedFiles: File[] = [];
    const rejectedFiles: Array<{ file: File; reason: string }> = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        rejectedFiles.push({
          file,
          reason: `Arquivo muito grande (máx. ${maxSize}MB)`
        });
        return;
      }

      // Check file type
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExt)) {
        rejectedFiles.push({
          file,
          reason: 'Tipo de arquivo não aceito'
        });
        return;
      }

      acceptedFiles.push(file);
    });

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, reason }) => {
        toast({
          title: "Arquivo rejeitado",
          description: `${file.name}: ${reason}`,
          variant: "destructive",
        });
      });
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: 'uploading' as const
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Simulate upload for each file
      for (const uploadFile of newFiles) {
        try {
          await simulateUpload(uploadFile.file, uploadFile.id);
        } catch (error) {
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'error', error: 'Erro ao fazer upload' }
              : f
          ));
        }
      }

      if (onUploadComplete) {
        onUploadComplete(acceptedFiles);
      }

      toast({
        title: "Upload concluído",
        description: `${acceptedFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });
    }
  }, [maxSize, maxFiles, acceptedTypes, onUploadComplete, toast]);

  // Drag and drop handlers without react-dropzone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAll = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-input')?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-[#7E69AB] bg-[#7E69AB]/10"
            : "border-gray-300 hover:border-[#7E69AB] hover:bg-gray-50"
        )}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
        />
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "p-4 rounded-full",
            isDragging
              ? "bg-[#7E69AB]"
              : "bg-gray-100"
          )}>
            <Upload className={cn(
              "h-8 w-8",
              isDragging
                ? "text-white"
                : "text-gray-400"
            )} />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragging
                ? "Solte os arquivos aqui"
                : "Arraste arquivos aqui ou clique para selecionar"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Formatos aceitos: {acceptedTypes.join(', ')} (máx. {maxSize}MB)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Máximo de {maxFiles} arquivos
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Arquivos Enviados ({uploadedFiles.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                Limpar Todos
              </Button>
            </div>
            <div className="space-y-3">
              {uploadedFiles.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className={cn(
                    "p-3 rounded-lg border flex items-center gap-3",
                    uploadFile.status === 'success'
                      ? "border-green-200 bg-green-50"
                      : uploadFile.status === 'error'
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadFile.file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mt-2 h-1" />
                    )}
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {uploadFile.status === 'uploading' && (
                      <div className="h-5 w-5 border-2 border-[#7E69AB] border-t-transparent rounded-full animate-spin" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(uploadFile.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;

