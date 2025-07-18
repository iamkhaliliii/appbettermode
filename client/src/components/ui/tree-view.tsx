"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Folder, File, FolderOpen, Plus, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
export type TreeNode = {
  id: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
  data?: any;
};

// Action Button Component with Portal Dropdown
function ActionButton({ 
  nodeId,
  onActionClick,
  getActionIcon,
  activeDropdown,
  renderDropdown
}: {
  nodeId: string;
  onActionClick?: (nodeId: string) => void;
  getActionIcon?: (nodeId: string) => React.ReactNode;
  activeDropdown?: string | null;
  renderDropdown?: (nodeId: string) => React.ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (activeDropdown === nodeId && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 180, // Assuming dropdown width is ~180px
      });
    }
  }, [activeDropdown, nodeId]);

  const isOpen = activeDropdown === nodeId && !!renderDropdown;

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded hover:bg-accent/70 transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onActionClick?.(nodeId);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {getActionIcon ? getActionIcon(nodeId) : <Plus className="h-3 w-3 text-muted-foreground" />}
      </motion.button>

      {/* Portal Dropdown */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 999999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {renderDropdown?.(nodeId)}
        </motion.div>,
        document.body
      )}
    </div>
  );
}

export type TreeViewProps = {
  data: TreeNode[];
  className?: string;
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  onActionClick?: (nodeId: string) => void;
  actionableNodes?: string[];
  renderDropdown?: (nodeId: string) => React.ReactNode;
  activeDropdown?: string | null;
  getActionIcon?: (nodeId: string) => React.ReactNode;
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
};

// Main TreeView component
export function TreeView({
  data,
  className,
  onNodeClick,
  onNodeExpand,
  onActionClick,
  actionableNodes = [],
  renderDropdown,
  activeDropdown,
  getActionIcon,
  defaultExpandedIds = [],
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds = [],
  onSelectionChange,
  indent = 20,
  animateExpand = true,
}: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds),
  );
  const [internalSelectedIds, setInternalSelectedIds] =
    useState<string[]>(selectedIds);

  const isControlled =
    selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback(
    (nodeId: string) => {
      setExpandedIds((prev) => {
        const newSet = new Set(prev);
        const isExpanded = newSet.has(nodeId);
        isExpanded ? newSet.delete(nodeId) : newSet.add(nodeId);
        onNodeExpand?.(nodeId, !isExpanded);
        return newSet;
      });
    },
    [onNodeExpand],
  );

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) return;

      let newSelection: string[];

      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      isControlled
        ? onSelectionChange?.(newSelection)
        : setInternalSelectedIds(newSelection);
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isControlled,
      onSelectionChange,
    ],
  );

  const renderNode = (
    node: TreeNode,
    level = 0,
    isLast = false,
    parentPath: boolean[] = [],
  ) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = currentSelectedIds.includes(node.id);
    const isActionable = actionableNodes.includes(node.id);
    const currentPath = [...parentPath, isLast];

    const getDefaultIcon = () =>
      hasChildren ? (
        isExpanded ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <Folder className="h-4 w-4" />
        )
      ) : (
        <File className="h-4 w-4" />
      );

    return (
      <div key={node.id} className="select-none" style={{ overflow: 'visible', position: 'relative' }}>
        <motion.div
          className={cn(
            "flex items-center py-2 px-3 cursor-pointer transition-all duration-200 relative group rounded-md mx-1",
            "hover:bg-accent/50",
            isSelected && "bg-accent/80",
            selectable && "hover:border-accent-foreground/10",
          )}
          style={{ paddingLeft: level * indent + 8, overflow: 'visible', position: 'relative' }}
          onClick={(e) => {
            if (hasChildren) toggleExpanded(node.id);
            handleSelection(node.id, e.ctrlKey || e.metaKey);
            onNodeClick?.(node);
          }}
          whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        >
          {/* Tree Lines */}
          {showLines && level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 pointer-events-none">
              {currentPath.map((isLastInPath, pathIndex) => (
                <div
                  key={pathIndex}
                  className="absolute top-0 bottom-0 border-l border-border/40"
                  style={{
                    left: pathIndex * indent + 12,
                    display:
                      pathIndex === currentPath.length - 1 && isLastInPath
                        ? "none"
                        : "block",
                  }}
                />
              ))}
              <div
                className="absolute top-1/2 border-t border-border/40"
                style={{
                  left: (level - 1) * indent + 12,
                  width: indent - 4,
                  transform: "translateY(-1px)",
                }}
              />
              {isLast && (
                <div
                  className="absolute top-0 border-l border-border/40"
                  style={{
                    left: (level - 1) * indent + 12,
                    height: "50%",
                  }}
                />
              )}
            </div>
          )}

          {/* Expand Icon */}
          <motion.div
            className="flex items-center justify-center w-4 h-4 mr-1"
            animate={{ rotate: hasChildren && isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {hasChildren && (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </motion.div>

          {/* Node Icon */}
          {showIcons && (
            <motion.div
              className="flex items-center justify-center w-4 h-4 mr-2 text-muted-foreground"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
            >
              {node.icon || getDefaultIcon()}
            </motion.div>
          )}

          {/* Label */}
          <div className="text-sm font truncate flex-1">
            {node.label}
          </div>

          {/* Action Button */}
          {isActionable && (
            <ActionButton
              nodeId={node.id}
              onActionClick={onActionClick}
              getActionIcon={getActionIcon}
              activeDropdown={activeDropdown}
              renderDropdown={renderDropdown}
            />
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: animateExpand ? 0.3 : 0,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{
                  duration: animateExpand ? 0.2 : 0,
                  delay: animateExpand ? 0.1 : 0,
                }}
              >
                {node.children!.map((child, index) =>
                  renderNode(
                    child,
                    level + 1,
                    index === node.children!.length - 1,
                    currentPath,
                  ),
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={cn(
        "w-full bg-background border border-border rounded-xl relative",
        className,
      )}
      style={{ overflow: 'visible', zIndex: 1 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="p-2" style={{ overflow: 'visible' }}>
        {data.map((node, index) =>
          renderNode(node, 0, index === data.length - 1),
        )}
      </div>
    </motion.div>
  );
} 