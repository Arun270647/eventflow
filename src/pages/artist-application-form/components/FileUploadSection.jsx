import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FileUploadSection = ({ 
  formData, 
  errors, 
  onChange,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;
  const allowedTypes = {
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac'],
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  const uploadedFiles = formData?.uploadedFiles || [];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(Array.from(e?.dataTransfer?.files));
    }
  };

  const handleFileInput = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(Array.from(e?.target?.files));
    }
  };

  const handleFiles = (files) => {
    if (uploadedFiles?.length + files?.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files?.filter(file => {
      const isValidType = Object.values(allowedTypes)?.flat()?.includes(file?.type);
      const isValidSize = file?.size <= maxFileSize;
      
      if (!isValidType) {
        alert(`${file?.name}: File type not supported`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file?.name}: File size must be less than 10MB`);
        return false;
      }
      
      return true;
    });

    // Simulate file upload with progress
    validFiles?.forEach((file, index) => {
      const fileId = Date.now() + index;
      const fileObj = {
        id: fileId,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        uploadedAt: new Date()?.toISOString(),
        url: URL.createObjectURL(file) // In real app, this would be the server URL
      };

      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev?.[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            // Add file to uploaded files list
            const newFiles = [...uploadedFiles, fileObj];
            onChange('uploadedFiles', newFiles);
            
            // Remove from progress tracking
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 100);
    });
  };

  const removeFile = (fileId) => {
    const newFiles = uploadedFiles?.filter(file => file?.id !== fileId);
    onChange('uploadedFiles', newFiles);
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('audio/')) return 'Music';
    if (fileType?.startsWith('image/')) return 'Image';
    if (fileType?.includes('pdf')) return 'FileText';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileTypeCategory = (fileType) => {
    if (allowedTypes?.audio?.includes(fileType)) return 'Audio Demo';
    if (allowedTypes?.image?.includes(fileType)) return 'Press Photo';
    if (allowedTypes?.document?.includes(fileType)) return 'Document';
    return 'File';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          File Uploads
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload demo tracks, press photos, or other supporting materials. All files are optional but can strengthen your application.
        </p>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          accept={Object.values(allowedTypes)?.flat()?.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Upload" size={24} className="text-primary" />
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              Drop files here or click to browse
            </h4>
            <p className="text-sm text-muted-foreground">
              Supports audio files (MP3, WAV, M4A), images (JPG, PNG), and documents (PDF, DOC)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: 10MB • Maximum {maxFiles} files
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="FolderOpen"
            iconPosition="left"
            iconSize={16}
          >
            Choose Files
          </Button>
        </div>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress)?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Uploading...</h4>
          {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
            <div key={fileId} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Uploading file...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Uploaded Files */}
      {uploadedFiles?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Uploaded Files ({uploadedFiles?.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles?.map((file) => (
              <div key={file?.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={getFileIcon(file?.type)} size={20} className="text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getFileTypeCategory(file?.type)} • {formatFileSize(file?.size)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {new Date(file.uploadedAt)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file?.id)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                  />
                </div>
                
                {file?.type?.startsWith('image/') && (
                  <div className="mt-3">
                    <img
                      src={file?.url}
                      alt={file?.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* File Type Guidelines */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">File Upload Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Audio Demos</p>
                <ul className="space-y-0.5">
                  <li>• MP3, WAV, M4A formats</li>
                  <li>• 2-3 of your best tracks</li>
                  <li>• High quality recordings preferred</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Press Photos</p>
                <ul className="space-y-0.5">
                  <li>• JPG, PNG formats</li>
                  <li>• High resolution (300 DPI+)</li>
                  <li>• Professional headshots preferred</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Documents</p>
                <ul className="space-y-0.5">
                  <li>• PDF, DOC formats</li>
                  <li>• Press kits, rider, bio</li>
                  <li>• Technical requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {errors?.uploadedFiles && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{errors?.uploadedFiles}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;