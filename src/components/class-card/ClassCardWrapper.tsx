import { Class } from '@/types';
import React from 'react';
import { useRouter } from 'next/navigation';
import ClassCard from './ClassCard';

export interface ClassCardWrapperProps {
  classItem: Class;
  buttonText?: string;
}

const ClassCardWrapper: React.FC<ClassCardWrapperProps> = ({
  classItem,
  buttonText = 'View Details',
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/classes/${classItem.id}`);
  };

  return (
    <ClassCard
      imageUrl={classItem.image}
      title={classItem.name}
      description={classItem.brief}
      titleButton={buttonText}
      onButtonClick={handleButtonClick}
    />
  );
};

export default ClassCardWrapper;
