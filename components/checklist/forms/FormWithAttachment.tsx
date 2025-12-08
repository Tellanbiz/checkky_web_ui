'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from 'lucide-react';

interface FormWithAttachmentProps {
  hasAttachment: boolean;
  photoUrl?: string | null;
  children: ReactNode;
}

export function FormWithAttachment({
  hasAttachment,
  photoUrl,
  children
}: FormWithAttachmentProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        {/* Attachment Section */}
        {hasAttachment && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Photo Attachment</span>
              <Badge variant="outline" className="text-xs">
                {photoUrl ? 'Uploaded' : 'Required'}
              </Badge>
            </div>
            
            {photoUrl ? (
              <div className="space-y-2">
                <div className="relative group">
                  <img
                    src={photoUrl}
                    alt="Attached photo"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Image className="w-8 h-8 mr-2" />
                <span className="text-sm">No Images uploaded</span>
              </div>
            )}
          </div>
        )}

        {/* Question Content */}
        <div className="space-y-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
