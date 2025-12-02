import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, FileText, Plus } from "lucide-react";
import { PublicChecklist } from "@/lib/services/checklist/models";

interface TemplateCardProps {
  template: PublicChecklist;
  onAddToChecklist: (template: PublicChecklist) => void;
  isAssigning: boolean;
}

export function TemplateCard({ template, onAddToChecklist, isAssigning }: TemplateCardProps) {
  return (
    <div 
      className={`border rounded-lg transition-colors bg-white cursor-pointer ${
        isAssigning 
          ? 'border-blue-500 bg-blue-50' 
          : 'hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => !isAssigning && onAddToChecklist(template)}
    >
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">
            {template.name}
          </h3>
          <Badge variant="secondary" className="ml-2">
            <Building className="h-3 w-3 mr-1" />
            {template.company.name}
          </Badge>
        </div>
      </div>
      <div className="px-6 pb-6 space-y-4">
        {template.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {template.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {template.section_count} sections
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(template.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{template.item_count} items</span>
          {isAssigning && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Adding...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
