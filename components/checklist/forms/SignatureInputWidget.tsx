'use client';

import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Pen, Download, Trash2, Camera, Image } from 'lucide-react';

interface SignatureInputWidgetProps {
  question: {
    id: number;
    checklist_item_caption: string;
    default_answer: string | null;
    answer_options: string[];
    corrective_actions: string[];
    policy: string | null;
    is_answered: boolean;
  };
  value: string;
  onAnswerChanged: (value: string | null) => void;
  onCommentChanged: (comment: string) => void;
  onGalleryPressed: () => void;
  onCameraPressed: () => void;
}

export function SignatureInputWidget({
  question,
  value,
  onAnswerChanged,
  onCommentChanged,
  onGalleryPressed,
  onCameraPressed
}: SignatureInputWidgetProps) {
  const [comment, setComment] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = document.createElement('img');
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = value;
        setSignatureData(value);
      }
    }
  }, [value]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    onCommentChanged(newComment);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL();
      setSignatureData(dataUrl);
      onAnswerChanged(dataUrl);
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignatureData(null);
    onAnswerChanged(null);
  };

  const downloadSignature = () => {
    if (signatureData) {
      const link = document.createElement('a');
      link.download = `signature-${question.id}.png`;
      link.href = signatureData;
      link.click();
    }
  };

  return (
    <div className="space-y-3">
      {/* Question Label */}
      <div className="flex items-start justify-between">
        <Label className="text-sm font-medium leading-6">
          {question.checklist_item_caption}
        </Label>
        {question.is_answered && (
          <Badge variant="secondary" className="text-xs">
            Signed
          </Badge>
        )}
      </div>

        {/* Signature Canvas */}
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white opacity-60">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="w-full border border-gray-200 rounded bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ pointerEvents: 'none' }}
            />
          </div>
        
        {/* Signature Controls */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="flex-1"
            disabled
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadSignature}
            disabled={!signatureData}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Alternative Input Methods */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGalleryPressed}
            className="flex-1"
            disabled
          >
            <Image className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCameraPressed}
            className="flex-1"
            disabled
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        </div>
      </div>

      {/* Comment Section */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600">Comments (Optional)</Label>
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add any additional comments..."
          className="min-h-[60px] resize-none text-sm text-gray-900"
          disabled
        />
      </div>

      {/* Policy Information */}
      {question.policy && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Policy:</span> {question.policy}
          </p>
        </div>
      )}

      {/* Corrective Actions */}
      {question.corrective_actions.length > 0 && (
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-800 font-medium mb-1">Corrective Actions:</p>
          <ul className="text-xs text-orange-700 space-y-1">
            {question.corrective_actions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
