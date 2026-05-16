import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, Search, Grid, List, Filter, Trash2, Download, Eye,
  X, Check, Copy, ZoomIn, Image as ImageIcon, Music, FileText, Video,
  AlertCircle, Loader2, File,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeletons';
import { cn } from '@/utils';
import { useGetProductsQuery } from '@/store/api/productsApi';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: Date;
  category: string;
  source: 'local' | 'api';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv';

const FILTER_OPTIONS = [
  { label: 'All',       value: 'all'      },
  { label: 'Images',    value: 'image'    },
  { label: 'Videos',    value: 'video'    },
  { label: 'Audio',     value: 'audio'    },
  { label: 'Documents', value: 'document' },
];

const SIZES = [204800, 512000, 153600, 307200, 409600, 102400, 614400, 256000,
               358400, 471040, 184320, 327680, 491520, 143360, 225280, 368640,
               286720, 430080, 122880, 245760];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/'))  return 'image';
  if (mimeType.startsWith('video/'))  return 'video';
  if (mimeType.startsWith('audio/'))  return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    mimeType === 'text/plain' ||
    mimeType === 'text/csv'
  ) return 'document';
  return 'other';
}

function MediaTypeIcon({ type, className }: { type: MediaType; className?: string }) {
  const icons: Record<MediaType, React.ElementType> = {
    image:    ImageIcon,
    video:    Video,
    audio:    Music,
    document: FileText,
    other:    File,
  };
  const Icon = icons[type] ?? File;
  return <Icon className={className} />;
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

interface PreviewModalProps {
  item: MediaItem;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDownload: (item: MediaItem) => void;
}

function PreviewModal({ item, onClose, onDelete, onDownload }: PreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('URL copied to clipboard');
    });
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3 min-w-0">
            <MediaTypeIcon type={item.type} className="h-5 w-5 text-muted-foreground" />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(item.size)} &bull; {item.mimeType}
                {item.width && item.height ? ` \u2022 ${item.width}\u00d7${item.height}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">{copied ? 'Copied' : 'Copy URL'}</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDownload(item)}>
              <Download className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Download</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => { onDelete(item.id); onClose(); }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Delete</span>
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/30 p-6 min-h-[300px]">
          {item.type === 'image' && (
            <img
              src={item.url}
              alt={item.name}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow"
            />
          )}
          {item.type === 'video' && (
            <video
              src={item.url}
              controls
              className="max-w-full max-h-[60vh] rounded-lg shadow"
            />
          )}
          {item.type === 'audio' && (
            <div className="flex flex-col items-center gap-4">
              <Music className="h-20 w-20 text-muted-foreground" />
              <audio src={item.url} controls className="w-full max-w-sm" />
            </div>
          )}
          {(item.type === 'document' || item.type === 'other') && (
            <div className="flex flex-col items-center gap-4 text-center">
              <FileText className="h-20 w-20 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Preview not available</p>
              <Button onClick={() => onDownload(item)}>
                <Download className="mr-2 h-4 w-4" /> Download to view
              </Button>
            </div>
          )}
        </div>

        {/* Footer meta */}
        <div className="p-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Uploaded: {item.uploadedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>Category: <span className="capitalize">{item.category}</span></span>
          <span>Source: {item.source === 'local' ? 'Uploaded by you' : 'API / Sample'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Drop Zone ─────────────────────────────────────────────────────────

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  uploading: boolean;
}

function DropZone({ onFiles, uploading }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none',
        dragOver
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border hover:border-primary/50 hover:bg-muted/30',
        uploading && 'pointer-events-none opacity-60'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED}
        className="hidden"
        onChange={handleChange}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium">Uploading files…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            dragOver ? 'bg-primary/20' : 'bg-muted'
          )}>
            <Upload className={cn('h-7 w-7', dragOver ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {dragOver ? 'Drop files here' : 'Drag & drop files or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Images, videos, audio, PDFs &bull; Max 50 MB per file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

interface GridCardProps {
  item: MediaItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (item: MediaItem) => void;
  onDelete: (id: string) => void;
}

function GridCard({ item, selected, onSelect, onPreview, onDelete }: GridCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl border overflow-hidden cursor-pointer transition-all',
        selected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50 hover:shadow-md'
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          'absolute top-2 left-2 z-10 h-5 w-5 rounded border-2 bg-background transition-opacity flex items-center justify-center',
          selected ? 'opacity-100 border-primary bg-primary' : 'opacity-0 group-hover:opacity-100 border-muted-foreground'
        )}
        onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
      >
        {selected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>

      {/* Thumbnail */}
      <div
        className="aspect-square bg-muted flex items-center justify-center overflow-hidden"
        onClick={() => onPreview(item)}
      >
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
            <MediaTypeIcon type={item.type} className="h-10 w-10" />
            <span className="text-xs uppercase font-medium">
              {item.mimeType.split('/')[1] ?? item.type}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(item); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors"
            title="Preview"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-xs font-medium truncate" title={item.name}>{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(item.size)}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MediaPage() {
  const [search, setSearch]           = useState('');
  const [view, setView]               = useState<'grid' | 'list'>('grid');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [preview, setPreview]         = useState<MediaItem | null>(null);
  const [uploading, setUploading]     = useState(false);
  const [localItems, setLocalItems]   = useState<MediaItem[]>([]);
  const [showUpload, setShowUpload]   = useState(false);

  const { data, isLoading, error, refetch } = useGetProductsQuery({ limit: 20 });

  // Build API-sourced items
  const apiItems = React.useMemo<MediaItem[]>(() => {
    if (!data?.products) return [];
    return data.products.map((p, idx) => ({
      id:          `api-${p.id}`,
      name:        `${p.title.replace(/\s+/g, '-').toLowerCase()}.jpg`,
      url:         p.thumbnail,
      type:        'image' as MediaType,
      mimeType:    'image/jpeg',
      size:        SIZES[idx % SIZES.length] ?? 204800,
      width:       400,
      height:      400,
      uploadedAt:  new Date(Date.now() - idx * 86400000),
      category:    p.category,
      source:      'api' as const,
    }));
  }, [data]);

  // All items = local uploads + api items
  const allItems = React.useMemo(
    () => [...localItems, ...apiItems],
    [localItems, apiItems]
  );

  // Filtered items
  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return allItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchType =
        typeFilter === 'all' || item.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [allItems, search, typeFilter]);

  // Stats
  const stats = React.useMemo(() => {
    const total = allItems.length;
    const totalSize = allItems.reduce((s, i) => s + i.size, 0);
    const byType = allItems.reduce<Record<string, number>>((acc, i) => {
      acc[i.type] = (acc[i.type] ?? 0) + 1;
      return acc;
    }, {});
    return { total, totalSize, byType };
  }, [allItems]);

  // ── Upload handler ──────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (files: File[]) => {
    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
    const valid = files.filter((f) => {
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name} exceeds 50 MB limit`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${valid.length} file${valid.length > 1 ? 's' : ''}…`);

    try {
      const newItems = await Promise.all(
        valid.map(
          (file) =>
            new Promise<MediaItem>((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => {
                const url = ev.target?.result as string;
                resolve({
                  id:         `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  name:       file.name,
                  url,
                  type:       getMediaType(file.type),
                  mimeType:   file.type || 'application/octet-stream',
                  size:       file.size,
                  uploadedAt: new Date(),
                  category:   'uploaded',
                  source:     'local',
                });
              };
              reader.readAsDataURL(file);
            })
        )
      );

      setLocalItems((prev) => [...newItems, ...prev]);
      toast.success(
        `${newItems.length} file${newItems.length > 1 ? 's' : ''} uploaded successfully`,
        { id: toastId }
      );
      setShowUpload(false);
    } catch {
      toast.error('Upload failed. Please try again.', { id: toastId });
    } finally {
      setUploading(false);
    }
  }, []);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
    toast.success('File deleted');
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const ids = Array.from(selected);
    setLocalItems((prev) => prev.filter((i) => !ids.includes(i.id)));
    setSelected(new Set());
    toast.success(`${ids.length} file${ids.length > 1 ? 's' : ''} deleted`);
  }, [selected]);

  // ── Download ────────────────────────────────────────────────────────────────
  const handleDownload = useCallback((item: MediaItem) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloading ${item.name}`);
  }, []);

  // ── Select ──────────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }, []);

  const selectAll = () => setSelected(new Set(filtered.map((i) => i.id)));
  const clearSelection = () => setSelected(new Set());

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Failed to load media</h3>
        <p className="text-sm text-muted-foreground">Could not fetch sample media from the API.</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  const selectedCount = selected.size;
  // Only locally-uploaded items can be deleted from selection
  const selectedDeletable = Array.from(selected).filter((id) =>
    localItems.some((i) => i.id === id)
  ).length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading…' : `${stats.total} files \u2022 ${formatBytes(stats.totalSize)} total`}
          </p>
        </div>
        <Button onClick={() => setShowUpload((v) => !v)} className="shrink-0">
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* ── Upload zone (toggle) ── */}
      {showUpload && (
        <DropZone onFiles={handleUpload} uploading={uploading} />
      )}

      {/* ── Stats row ── */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Files',  value: stats.total.toString() },
            { label: 'Images',       value: (stats.byType['image']    ?? 0).toString() },
            { label: 'Videos',       value: (stats.byType['video']    ?? 0).toString() },
            { label: 'Documents',    value: (stats.byType['document'] ?? 0).toString() },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold mt-0.5">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Filter className="h-4 w-4 text-muted-foreground ml-1" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                typeFilter === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 transition-colors',
              view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 transition-colors',
              view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <Badge variant="secondary" className="shrink-0">
          {filtered.length} {filtered.length === 1 ? 'file' : 'files'}
        </Badge>
      </div>

      {/* ── Bulk action bar ── */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-sm font-medium">
            {selectedCount} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {selectedDeletable > 0 && (
              <Button size="sm" variant="destructive" onClick={handleDeleteSelected}>
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete {selectedDeletable} uploaded
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={clearSelection}>
              <X className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      )}

      {/* ── Select all row ── */}
      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <button
            onClick={selectedCount === filtered.length ? clearSelection : selectAll}
            className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
          >
            {selectedCount === filtered.length ? 'Deselect all' : 'Select all'}
          </button>
        </div>
      )}

      {/* ── Grid View ── */}
      {view === 'grid' && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : filtered.length === 0
            ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-semibold">No files found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {search ? 'Try a different search term' : 'Upload some files to get started'}
                </p>
              </div>
            )
            : filtered.map((item) => (
                <GridCard
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onSelect={toggleSelect}
                  onPreview={setPreview}
                  onDelete={handleDelete}
                />
              ))}
        </div>
      )}

      {/* ── List View ── */}
      {view === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="w-10 p-4">
                      <input
                        type="checkbox"
                        checked={selectedCount === filtered.length && filtered.length > 0}
                        onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
                        className="accent-primary"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">File</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Size</th>
                    <th className="text-left p-4 font-medium">Uploaded</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4"><Skeleton className="h-4 w-4" /></td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          </td>
                          <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-14" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                          <td className="p-4"><Skeleton className="h-8 w-20" /></td>
                        </tr>
                      ))
                    : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-muted-foreground">
                          No files found
                        </td>
                      </tr>
                    )
                    : filtered.map((item) => (
                        <tr
                          key={item.id}
                          className={cn(
                            'border-b transition-colors hover:bg-muted/30',
                            selected.has(item.id) && 'bg-primary/5'
                          )}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selected.has(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="accent-primary"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="h-10 w-10 rounded-lg object-cover shrink-0 border"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border">
                                  <MediaTypeIcon type={item.type} className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <span className="font-medium truncate max-w-[200px]" title={item.name}>
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize text-xs">
                              {item.type}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="capitalize text-muted-foreground">{item.category}</span>
                          </td>
                          <td className="p-4 text-muted-foreground">{formatBytes(item.size)}</td>
                          <td className="p-4 text-muted-foreground whitespace-nowrap">
                            {item.uploadedAt.toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                title="Preview"
                                onClick={() => setPreview(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                title="Download"
                                onClick={() => handleDownload(item)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {item.source === 'local' && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  title="Delete"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Preview Modal ── */}
      {preview && (
        <PreviewModal
          item={preview}
          onClose={() => setPreview(null)}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
