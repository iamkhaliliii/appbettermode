import { useState } from "react";
import {
  LayoutGrid,
  LayoutList,
  Rows3,
  Columns,
  ExternalLink,
  Square,
  Hash,
  MoreHorizontal,
  Image,
  Crop,
  ChevronDown,
  Heading,
  AlignLeft,
  User,
  Calendar,
  Heart,
  MessageSquare
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";
import { NumberPropertyRow } from "./NumberPropertyRow";

export function DisplaySettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [layout, setLayout] = useState('grid');
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [showAuthor, setShowAuthor] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [cardSize, setCardSize] = useState('medium');
  const [openPageIn, setOpenPageIn] = useState('post_page');
  const [showMore, setShowMore] = useState(true);
  const [cardCover, setCardCover] = useState(true);
  const [fitCover, setFitCover] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [propertiesExpanded, setPropertiesExpanded] = useState(false);

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const layoutOptions = [
    { value: 'grid', label: 'Grid', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: LayoutList },
    { value: 'feed', label: 'Feed', icon: Rows3 }
  ];

  const renderPropertiesSection = () => (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setPropertiesExpanded(!propertiesExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <span>Properties</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${propertiesExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {propertiesExpanded && (
        <div className="space-y-0">
          <PropertyRow
            label="Title"
            value={showTitle}
            fieldName="showTitle"
            type="checkbox"
            onValueChange={setShowTitle}
            icon={Heading}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Excerpt"
            value={showExcerpt}
            fieldName="showExcerpt"
            type="checkbox"
            onValueChange={setShowExcerpt}
            icon={AlignLeft}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Author"
            value={showAuthor}
            fieldName="showAuthor"
            type="checkbox"
            onValueChange={setShowAuthor}
            icon={User}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Date"
            value={showDate}
            fieldName="showDate"
            type="checkbox"
            onValueChange={setShowDate}
            icon={Calendar}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Tags"
            value={showTags}
            fieldName="showTags"
            type="checkbox"
            onValueChange={setShowTags}
            icon={Hash}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Reactions"
            value={showReactions}
            fieldName="showReactions"
            type="checkbox"
            onValueChange={setShowReactions}
            icon={Heart}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Comments"
            value={showComments}
            fieldName="showComments"
            type="checkbox"
            onValueChange={setShowComments}
            icon={MessageSquare}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  );
      
  return (
    <div className="space-y-4">
      {/* Visual Layout Selector */}
      <div>
        <div className="grid grid-cols-3 gap-2 px-3">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setLayout(option.value)}
              className={`flex flex-col items-center justify-center aspect-square p-2 rounded-lg border-2 transition-all ${
                layout === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <option.icon className={`w-6 h-6 mb-1 ${
                layout === option.value 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} />
              <span className={`text-xs ${
                layout === option.value 
                  ? 'text-primary-600 dark:text-primary-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Conditional Settings */}
      <div className="space-y-0">
        {/* Grid specific settings */}
        {layout === 'grid' && (
          <>
            <PropertyRow
              label="Card size"
              value={cardSize}
              fieldName="cardSize"
              type="select"
              options={[
                { 
                  value: 'small', 
                  label: 'Small',
                  description: 'Compact cards with minimal content preview',
                  icon: Columns
                },
                { 
                  value: 'medium', 
                  label: 'Medium',
                  description: 'Balanced size with good content visibility',
                  icon: Columns
                },
                { 
                  value: 'large', 
                  label: 'Large',
                  description: 'Spacious cards with detailed content preview',
                  icon: Columns
                },
                { 
                  value: 'extra_large', 
                  label: 'Extra Large',
                  description: 'Maximum size cards with full content display',
                  icon: Columns
                }
              ]}
              onValueChange={setCardSize}
              icon={Columns}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <PropertyRow
              label="Open page in"
              value={openPageIn}
              fieldName="openPageIn"
              type="select"
              options={[
                { 
                  value: 'modal_content', 
                  label: 'Modal content',
                  description: 'Open posts in an overlay modal window',
                  icon: Square
                },
                { 
                  value: 'post_page', 
                  label: 'Post page',
                  description: 'Navigate to a dedicated post page',
                  icon: ExternalLink
                }
              ]}
              onValueChange={setOpenPageIn}
              icon={ExternalLink}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <NumberPropertyRow
              label="Number of posts per page"
              value={postsPerPage}
              onValueChange={setPostsPerPage}
              min={1}
              max={100}
              icon={Hash}
            />

            <PropertyRow
              label='Display "Show more"'
              value={showMore}
              fieldName="showMore"
              type="checkbox"
              onValueChange={setShowMore}
              icon={MoreHorizontal}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <PropertyRow
              label="Card Cover"
              value={cardCover}
              fieldName="cardCover"
              type="checkbox"
              onValueChange={setCardCover}
              icon={Image}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            {cardCover && (
              <PropertyRow
                label="Fit cover"
                value={fitCover}
                fieldName="fitCover"
                type="checkbox"
                onValueChange={setFitCover}
                icon={Crop}
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {/* Properties Section for Grid */}
            {renderPropertiesSection()}
          </>
        )}

        {/* List specific settings */}
        {layout === 'list' && (
          <>
            <PropertyRow
              label="Open page in"
              value={openPageIn}
              fieldName="openPageIn"
              type="select"
              options={[
                { 
                  value: 'modal_content', 
                  label: 'Modal content',
                  description: 'Open posts in an overlay modal window',
                  icon: Square
                },
                { 
                  value: 'post_page', 
                  label: 'Post page',
                  description: 'Navigate to a dedicated post page',
                  icon: ExternalLink
                }
              ]}
              onValueChange={setOpenPageIn}
              icon={ExternalLink}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <NumberPropertyRow
              label="Number of posts per page"
              value={postsPerPage}
              onValueChange={setPostsPerPage}
              min={1}
              max={100}
              icon={Hash}
            />

            <PropertyRow
              label='Display "Show more"'
              value={showMore}
              fieldName="showMore"
              type="checkbox"
              onValueChange={setShowMore}
              icon={MoreHorizontal}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            {/* Properties Section for List */}
            {renderPropertiesSection()}
          </>
        )}

        {/* Feed specific settings */}
        {layout === 'feed' && (
          <>
            <PropertyRow
              label="Open page in"
              value={openPageIn}
              fieldName="openPageIn"
              type="select"
              options={[
                { 
                  value: 'modal_content', 
                  label: 'Modal content',
                  description: 'Open posts in an overlay modal window',
                  icon: Square
                },
                { 
                  value: 'post_page', 
                  label: 'Post page',
                  description: 'Navigate to a dedicated post page',
                  icon: ExternalLink
                }
              ]}
              onValueChange={setOpenPageIn}
              icon={ExternalLink}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <NumberPropertyRow
              label="Number of posts per page"
              value={postsPerPage}
              onValueChange={setPostsPerPage}
              min={1}
              max={100}
              icon={Hash}
            />

            <PropertyRow
              label='Display "Show more"'
              value={showMore}
              fieldName="showMore"
              type="checkbox"
              onValueChange={setShowMore}
              icon={MoreHorizontal}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            {/* Properties Section for Feed */}
            {renderPropertiesSection()}
          </>
        )}
      </div>
    </div>
  );
} 