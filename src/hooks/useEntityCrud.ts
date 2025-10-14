import { useCallback } from 'react';
import { useNotification } from './useNotification';

interface UseEntityCrudOptions<T, CreateT, UpdateT> {
  entities: T[];
  onEdit: (entity: T | null) => void;
  onDelete: (entity: T | null) => void;
  onAdd: () => void;
  onClose: () => void;
  createMutation: (data: CreateT) => Promise<never>;
  updateMutation: (id: string, data: UpdateT) => Promise<never>;
  deleteMutation: (id: string) => Promise<never>;
  entityName: string;
  getEntityId: (entity: T) => string | number;
  getEntityLabel: (entity: T) => string;
  createPayload: (data: Partial<T>, isUpdate?: boolean) => CreateT | UpdateT;
}

export const useEntityCrud = <T, CreateT, UpdateT>({
  entities,
  onEdit,
  onDelete,
  onAdd,
  onClose,
  createMutation,
  updateMutation,
  deleteMutation,
  entityName,
  getEntityId,
  getEntityLabel,
  createPayload,
}: UseEntityCrudOptions<T, CreateT, UpdateT>) => {
  const { showSuccess, showError } = useNotification();

  const handleEdit = useCallback(
    (entityId: string | number) => {
      console.log('handleEdit called with ID:', entityId); // Debug log
      const entity =
        entities.find((x) => String(getEntityId(x)) === String(entityId)) ??
        null;
      console.log('Found entity:', entity); // Debug log
      onEdit(entity);
      onAdd(); // This should open the modal
    },
    [entities, onEdit, getEntityId, onAdd]
  );

  const handleDeleteClick = useCallback(
    (entityId: string | number) => {
      const entity =
        entities.find((x) => String(getEntityId(x)) === String(entityId)) ??
        null;
      onDelete(entity);
    },
    [entities, onDelete, getEntityId]
  );

  const handleConfirmDelete = useCallback(
    async (entityToDelete: T | null) => {
      if (!entityToDelete) return;
      try {
        await deleteMutation(String(getEntityId(entityToDelete)));
        showSuccess(
          `${entityName} "${getEntityLabel(entityToDelete)}" was deleted successfully`
        );
        onDelete(null);
      } catch (err) {
        console.error(`Failed to delete ${entityName}:`, err);
        showError(`Failed to delete ${entityName}. Please try again.`);
      }
    },
    [
      deleteMutation,
      getEntityId,
      getEntityLabel,
      entityName,
      showSuccess,
      showError,
      onDelete,
    ]
  );

  const handleAddNew = useCallback(() => {
    onEdit(null);
    onAdd();
  }, [onEdit, onAdd]);

  const handleFormSubmit = useCallback(
    async (data: Partial<T>, selectedEntity: T | null) => {
      try {
        if (selectedEntity) {
          const payload = createPayload(data, true) as UpdateT;
          await updateMutation(String(getEntityId(selectedEntity)), payload);
          showSuccess(
            `${entityName} "${getEntityLabel({ ...selectedEntity, ...data } as T)}" was updated successfully`
          );
        } else {
          const payload = createPayload(data, false) as CreateT;
          await createMutation(payload);
          showSuccess(
            `${entityName} "${getEntityLabel(data as T)}" was created successfully`
          );
        }
        onEdit(null);
        onClose();
      } catch (err) {
        console.error(`Failed to save ${entityName}:`, err);
        showError(`Failed to save ${entityName}. Please try again.`);
      }
    },
    [
      createPayload,
      createMutation,
      updateMutation,
      getEntityId,
      getEntityLabel,
      entityName,
      showSuccess,
      showError,
      onEdit,
      onClose,
    ]
  );

  return {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
    handleFormSubmit,
  };
};
