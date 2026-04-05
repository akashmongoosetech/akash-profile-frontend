import React, { useRef, useState } from 'react';
import CKEditorComponent from './CKEditorComponent';
import type { Editor } from '@ckeditor/ckeditor5-core';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';
import { normalizeImageUrl, uploadImage } from '../utils/api';
import Loader from '../components/Loader';
import {
  Plus,
  Trash2,
  Tag,
  FileText,
  BarChart3,
  Code,
  Move,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface ContentSection {
  title: string;
  content: string;
  image: string;
  code: string;
  order: number;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentSections: ContentSection[];
  image: string;
  author: string;
  authorProfile: string;
  authorProfilePic: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface BlogFormProps {
  formData: BlogFormData;
  setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
  editingBlog: { _id: string } | null;
  isSubmitting: boolean;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  showCustomCategory: boolean;
  setShowCustomCategory: React.Dispatch<React.SetStateAction<boolean>>;
  customCategory: string;
  setCustomCategory: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  formData,
  setFormData,
  editingBlog,
  isSubmitting,
  categories,
  setCategories,
  showCustomCategory,
  setShowCustomCategory,
  customCategory,
  setCustomCategory,
  onSubmit,
  onCancel
}) => {
  // Refs for CKEditor instances
  const contentEditorRef = useRef<Editor | null>(null);
  const excerptEditorRef = useRef<Editor | null>(null);

  // State for image upload loading
  const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);



  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle custom category addition
  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      const newCategory = customCategory.trim();
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, category: newCategory }));
      setCustomCategory('');
      setShowCustomCategory(false);
    }
  };

  // Handle tags input with better comma separation
  const handleTagsInput = (value: string) => {
    const tags = value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    setFormData(prev => ({ 
      ...prev, 
      tags: tags
    }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'tags') {
      handleTagsInput(value);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        ...(name === 'title' && { slug: generateSlug(value) })
      }));
    }
  };

  // Handle content section changes
  const handleContentSectionChange = (index: number, field: keyof ContentSection, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      contentSections: prev.contentSections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  // Add new content section
  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      contentSections: [...prev.contentSections, {
        title: '',
        content: '',
        image: '',
        code: '',
        order: prev.contentSections.length
      }]
    }));
  };

  // Remove content section
  const removeContentSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contentSections: prev.contentSections.filter((_, i) => i !== index)
        .map((section, i) => ({ ...section, order: i }))
    }));
  };

  // Move content section up/down
  const moveContentSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.contentSections.length) return;

    setFormData(prev => {
      const sections = [...prev.contentSections];
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return {
        ...prev,
        contentSections: sections.map((section, i) => ({ ...section, order: i }))
      };
    });
  };

  // Handle main image upload
  const handleMainImageUpload = async (file: File) => {
    setUploadingMainImage(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingMainImage(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (file: File) => {
    setUploadingProfilePic(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, authorProfilePic: imageUrl }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingProfilePic(false);
    }
  };

  // Handle image upload for content sections
  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImages(prev => ({ ...prev, [index]: true }));
    try {
      const imageUrl = await uploadImage(file);
      handleContentSectionChange(index, 'image', imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };


  // CKEditor dark theme configuration
  const ckeditorDarkConfig = {
    toolbar: [
      'bold', 'italic', 'underline', '|',
      'bulletedList', 'numberedList', '|',
      'link', 'imageUpload', 'image', '|',
      'undo', 'redo'
    ],
    placeholder: "Brief description of the blog post...",
    contentsCss: [
      'body { background-color: #1e293b; color: #f1f5f9; }',
      'a { color: #60a5fa; }',
      '.ck-placeholder { color: #94a3b8; }'
    ]
  };

  const ckeditorContentConfig = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'bulletedList', 'numberedList', '|',
      'link', 'blockquote', '|',
      'insertTable', 'imageUpload', 'image', '|',
      'undo', 'redo'
    ],
    placeholder: "Write your blog post content here...",
    contentsCss: [
      'body { background-color: #1e293b; color: #f1f5f9; }',
      'a { color: #60a5fa; }',
      '.ck-placeholder { color: #94a3b8; }'
    ]
  };

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <div className="space-y-3">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
            
            {/* Custom Category Option */}
            {!showCustomCategory ? (
              <button
                type="button"
                onClick={() => setShowCustomCategory(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Custom Category
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(false);
                    setCustomCategory('');
                  }}
                  className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              💡 You can select from existing categories or add your own custom category.
            </p>
          </div>
        </div>

        {/* Read Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Read Time
          </label>
          <input
            type="text"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            placeholder="5 min read"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Image URL *
        </label>
        <div className="space-y-3">
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleMainImageUpload(file);
                }
              }}
              className="hidden"
              id="main-image-upload"
              disabled={uploadingMainImage}
            />
            <label
              htmlFor="main-image-upload"
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {uploadingMainImage ? <Loader /> : 'Upload Image'}
            </label>
          </div>
          {formData.image && (
            <div className="mt-2">
              <img
                src={normalizeImageUrl(formData.image)}
                alt="Blog preview"
                className="max-w-full h-48 object-cover rounded-lg border border-white/20"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Excerpt *
          <span className="text-gray-500 text-xs ml-2">(Max 1000 characters)</span>
        </label>
        <CKEditorComponent
          config={ckeditorDarkConfig}
          data={formData.excerpt}
          onReady={(editor: Editor) => {
            excerptEditorRef.current = editor;
          }}
          onChange={(_event: EventInfo<string, unknown>, editor: Editor) => {
            const data = editor.getData();
            if (data.length <= 1000) {
              setFormData(prev => ({ ...prev, excerpt: data }));
            }
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.excerpt.replace(/<[^>]*>/g, '').length}/1000 characters
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content *
        </label>
        <CKEditorComponent
          config={ckeditorContentConfig}
          data={formData.content}
          onReady={(editor: Editor) => {
            contentEditorRef.current = editor;
          }}
          onChange={(_event: EventInfo<string, unknown>, editor: Editor) => {
            const data = editor.getData();
            setFormData(prev => ({ ...prev, content: data }));
          }}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags
          <span className="text-gray-500 text-xs ml-2">(Separate with commas)</span>
        </label>
        <div className="space-y-3">
          <input
            type="text"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleInputChange}
            placeholder="react, javascript, tutorial, web development, nodejs, express"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
          
          {/* Tags Preview */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = formData.tags.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, tags: newTags }));
                    }}
                    className="ml-1 hover:text-red-300 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            💡 Tip: Type unlimited tags separated by commas. Each tag will appear as a badge above. You can click × to remove individual tags.
          </p>
        </div>
      </div>

      {/* Author Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Author Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Author Name *
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            placeholder="Author Name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Author Profile */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Author Profile
          </label>
          <textarea
            name="authorProfile"
            value={formData.authorProfile}
            onChange={handleInputChange}
            rows={3}
            placeholder="Brief author bio or description..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
          />
        </div>
      </div>

      {/* Author Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Author Profile Picture URL
        </label>
        <div className="space-y-3">
          <input
            type="url"
            name="authorProfilePic"
            value={formData.authorProfilePic}
            onChange={handleInputChange}
            placeholder="https://example.com/profile-pic.jpg"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleProfilePicUpload(file);
                }
              }}
              className="hidden"
              id="profile-pic-upload"
              disabled={uploadingProfilePic}
            />
            <label
              htmlFor="profile-pic-upload"
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {uploadingProfilePic ? <Loader /> : 'Upload Image'}
            </label>
          </div>
          {formData.authorProfilePic && (
            <div className="mt-2">
              <img
                src={normalizeImageUrl(formData.authorProfilePic)}
                alt="Author profile preview"
                className="w-16 h-16 object-cover rounded-full border border-white/20"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Content Sections
          </h3>
          <button
            type="button"
            onClick={addContentSection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        {formData.contentSections.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No additional content sections. Click "Add Section" to create rich content blocks.</p>
        ) : (
          <div className="space-y-4">
            {formData.contentSections.map((section, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Section {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveContentSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Move className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveContentSection(index, 'down')}
                      disabled={index === formData.contentSections.length - 1}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Move className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeContentSection(index)}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Section Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleContentSectionChange(index, 'title', e.target.value)}
                      placeholder="Section heading..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm"
                    />
                  </div>

                  {/* Section Content */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <CKEditorComponent
                      key={`section-${index}-${editingBlog?._id || 'new'}`}
                      config={ckeditorDarkConfig}
                      data={section.content}
                      onChange={(_event: EventInfo<string, unknown>, editor: Editor) => {
                        const data = editor.getData();
                        handleContentSectionChange(index, 'content', data);
                      }}
                    />
                  </div>

                  {/* Section Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={section.image}
                        onChange={(e) => handleContentSectionChange(index, 'image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(index, file);
                            }
                          }}
                          className="hidden"
                          id={`image-upload-${index}`}
                          disabled={uploadingImages[index]}
                        />
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImages[index] ? <Loader /> : 'Upload Image'}
                        </label>
                      </div>
                      {section.image && (
                        <div className="mt-2">
                          <img
                            src={normalizeImageUrl(section.image)}
                            alt="Section preview"
                            className="max-w-full h-32 object-cover rounded-lg border border-white/20"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Code */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      Code Block
                    </label>
                    <textarea
                      value={section.code}
                      onChange={(e) => handleContentSectionChange(index, 'code', e.target.value)}
                      rows={4}
                      placeholder="Code snippet..."
                      className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:border-blue-400 resize-none text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Settings */}
      <div className="border-t border-white/10 pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            SEO Settings
          </h3>
          <p className="text-sm text-gray-400">
            Optimize your blog post for search engines and social media sharing
          </p>
        </div>
        
        <div className="space-y-4">
          {/* SEO Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta Title
              <span className="text-gray-500 text-xs ml-2">(Max 60 characters)</span>
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleInputChange}
              maxLength={60}
              placeholder="SEO optimized title for search engines"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.seoTitle.length}/60 characters
            </div>
          </div>

          {/* SEO Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta Description
              <span className="text-gray-500 text-xs ml-2">(Max 160 characters)</span>
            </label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleInputChange}
              maxLength={160}
              rows={3}
              placeholder="Brief description for search engine results..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.seoDescription.length}/160 characters
            </div>
          </div>

          {/* SEO Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SEO Keywords
              <span className="text-gray-500 text-xs ml-2">(Max 200 characters, comma-separated)</span>
            </label>
            <input
              type="text"
              name="seoKeywords"
              value={formData.seoKeywords}
              onChange={handleInputChange}
              maxLength={200}
              placeholder="react, javascript, web development, tutorial"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.seoKeywords.length}/200 characters
            </div>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
          />
          <span className="text-gray-300">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
          />
          <span className="text-gray-300">Published</span>
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg font-semibold transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Saving...' : (editingBlog ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
