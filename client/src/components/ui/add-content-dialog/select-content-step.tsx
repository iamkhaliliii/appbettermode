import * as React from "react";
import { motion } from "framer-motion";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContentCard } from "./content-card";

// ContentType interface
interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
}

interface SelectContentStepProps {
  exitDirection: "left" | "right";
  slideVariants: any;
  contentTypes: ContentType[];
  handleContentClick: (title: string) => void;
}

export function SelectContentStep({
  exitDirection,
  slideVariants,
  contentTypes,
  handleContentClick
}: SelectContentStepProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <motion.div
      key="selection"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideVariants}
      custom={exitDirection}
      className="space-y-6 p-10"
    >
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose a content type
        </DialogTitle>
        <DialogDescription className="text-gray-500 dark:text-gray-400">
          Select the type of content you want to create for your community.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentTypes.map((content, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: 0, transition: { duration: 0.2 } }}
          >
            <ContentCard
              title={content.title}
              description={content.description}
              icon={content.icon}
              color={content.color}
              preview={content.preview}
              onClick={() => handleContentClick(content.title)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 