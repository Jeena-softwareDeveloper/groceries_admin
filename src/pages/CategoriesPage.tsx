import { useState } from 'react';
import { Eye, Edit, Trash2, Tag, Plus, X, Power, PowerOff } from 'lucide-react';
import { categoryApi } from '../api';
import { useApiData } from '../hooks';
import { PageHeader, SearchBar, DataTable, Pagination, StatusBadge, EmptyState, ColumnDef, Modal } from '../components/ui';
import type { Category } from '../types';

export default function CategoriesPage() {
  const { data: categories = [], loading, refetch } = useApiData(() => categoryApi.getAll());
  
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setName('');
    setSlug('');
    setParentId('');
    setIsActive(true);
    setEditCategory(null);
    setShowForm(false);
  };

  const handleEditClick = (c: Category, parent?: string) => {
    setName(c.name);
    setSlug(c.slug);
    setParentId(parent || c.parentId || '');
    setIsActive(c.isActive);
    setEditCategory(c);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCategory) {
      await categoryApi.update(editCategory.id, { name, slug, parentId: parentId || undefined, isActive });
    } else {
      await categoryApi.create({ name, slug, parentId: parentId || undefined, isActive });
    }
    resetForm();
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await categoryApi.delete(id);
      refetch();
    }
  };
  
  const handleToggleStatus = async (c: Category) => {
    await categoryApi.update(c.id, { isActive: !c.isActive });
    refetch();
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // Column Actions
  const renderActions = (c: Category, parent?: string) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={(e) => { e.stopPropagation(); handleToggleStatus(c); }}
        className={`w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg cursor-pointer transition-colors ${c.isActive ? 'text-amber-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600' : 'text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600'}`}
        title={c.isActive ? "Deactivate" : "Activate"}
      >
        {c.isActive ? <PowerOff size={14} strokeWidth={2.5} /> : <Power size={14} strokeWidth={2.5} />}
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); handleEditClick(c, parent); }}
        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        <Edit size={14} strokeWidth={2.5} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-red-400 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
      >
        <Trash2 size={14} strokeWidth={2.5} />
      </button>
    </div>
  );

  const columns: ColumnDef<Category>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6 font-semibold text-slate-400',
      cell: (_, index) => String(index + 1).padStart(2, '0')
    },
    {
      key: 'name',
      header: 'Name',
      cell: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            <Tag size={14} className="text-slate-400" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-900">{c.name}</span>
        </div>
      )
    },
    {
      key: 'slug',
      header: 'Slug',
      cell: (c) => (
        <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold lowercase font-mono tracking-tight">
          {c.slug}
        </span>
      )
    },
    {
      key: 'subcategories',
      header: 'Subcategories',
      cell: (c) => (
        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold">
          {c.children?.length ?? 0}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => (
        <StatusBadge 
          status={c.isActive ? 'Active' : 'Inactive'} 
          colorMap={{
            Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            Inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
          }} 
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'pr-6',
      cellClassName: 'pr-6',
      cell: (c) => renderActions(c)
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12 text-slate-900">
      <PageHeader 
        title="Categories" 
        description="Manage product categories and their hierarchy." 
        action={
          <button
            className="flex items-center gap-2 bg-slate-900 border border-transparent text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Category
          </button>
        }
      />

      <Modal 
        isOpen={showForm || !!editCategory} 
        onClose={resetForm}
        title={editCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category Name</label>
            <input
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-full"
              placeholder="e.g. Fruits & Vegetables"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Slug</label>
            <input
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-full"
              placeholder="e.g. fruits-vegetables"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Parent Category</label>
            <select
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-full"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">None (Top Level)</option>
              {categories.filter(c => c.id !== editCategory?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="text-sm font-bold text-slate-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {editCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      <DataTable 
        columns={columns}
        data={filteredCategories}
        loading={loading}
        renderExpandedRow={(c) => {
          if (!c.children || c.children.length === 0) {
            return <div className="p-6 text-slate-400 text-sm font-medium text-center">No subcategories found</div>;
          }
          return (
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Subcategories</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {c.children.map(child => (
                  <div key={child.id} className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                         <Tag size={12} className="text-slate-400" />
                       </div>
                       <div>
                         <p className="font-bold text-slate-900 text-sm">{child.name}</p>
                         <p className="text-xs text-slate-500 font-mono mt-0.5">{child.slug}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <StatusBadge 
                          status={child.isActive ? 'Active' : 'Inactive'} 
                          colorMap={{
                            Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                            Inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
                          }} 
                        />
                        {renderActions(child, c.id)}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
        emptyState={
          <EmptyState 
            icon={Tag} 
            title="No categories yet" 
            description={search ? "No categories match your search." : "Click \"Add Category\" to create your first one."}
            action={!search && (
              <button
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                onClick={() => setShowForm(true)}
              >
                <Plus size={14} strokeWidth={2.5} /> Add Category
              </button>
            )}
          />
        }
        pagination={
          filteredCategories.length > 0 && (
            <Pagination 
              total={filteredCategories.length}
              page={1}
              limit={10}
              entityName="categories"
            />
          )
        }
      />
    </div>
  );
}

