import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User } from '@/lib/api';

interface CollaborationIndicatorProps {
  users: User[];
  maxVisible?: number;
}

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({ 
  users, 
  maxVisible = 3 
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-collaborator-1', 'bg-collaborator-2', 'bg-collaborator-3'];
    return colors[index % colors.length];
  };

  if (users.length === 0) return null;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className={`h-8 w-8 border-2 border-background ${getAvatarColor(index)}`}>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                <AvatarFallback className="text-white text-xs font-medium">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.username} is editing</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background bg-muted">
                <AvatarFallback className="text-xs font-medium">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more {remainingCount === 1 ? 'person' : 'people'} editing</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};