'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function FileUpload() {
  const navigation = useRouter();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Shouldn't be possible due to maxFiles, but still need to check
      if (acceptedFiles.length !== 1) {
        console.error('Only one file can be uploaded');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const content = reader.result;
        if (typeof content === 'string') {
          try {
            const data = JSON.parse(content);
            const id = self.crypto.randomUUID();
            localStorage.setItem(
              `document-${id}`,
              JSON.stringify({
                name: 'Untitled',
                data,
              })
            );
            navigation.push(id);
          } catch (error) {
            console.error('Failed to parse JSON:', error);
          }
        }
      };

      reader.readAsText(acceptedFiles[0]);
    },
    [navigation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'aplication/json': ['.json'],
    },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-8 mt-3">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag & drop files here, or click to select</p>
      )}
    </div>
  );
}
