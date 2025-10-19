import { ClassApiFilters } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { classApiClient } from '@/api';

interface UseClassesPublicQueryParams extends Partial<ClassApiFilters> {
  page?: number;
  size?: number;
}

export const useClassesPublicQuery = ({
  subjectId,
  gradeId,
  type,
  page = 0,
  size = 12,
}: UseClassesPublicQueryParams = {}) => {
  return useQuery({
    queryKey: ['classes', 'public', subjectId, gradeId, type, page, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subjectId) params.append('subjectId', subjectId.toString());
      if (gradeId) params.append('gradeId', gradeId.toString());
      if (type) params.append('type', type);
      params.append('page', page.toString());
      params.append('size', size.toString());

      return await classApiClient.getAllPublicClasses({
        subjectId,
        gradeId,
        type,
        page,
        size,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
