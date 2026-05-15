import { useState } from 'react';
import { Download, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

const EXPORT_FORMATS = [
  { id: 'csv', label: 'CSV', desc: 'Comma-separated values, compatible with Excel' },
  { id: 'json', label: 'JSON', desc: 'JavaScript Object Notation, for developers' },
  { id: 'xlsx', label: 'XLSX', desc: 'Microsoft Excel format' },
  { id: 'pdf', label: 'PDF', desc: 'Portable Document Format, for reports' },
];

const EXPORT_DATASETS = [
  { id: 'users', label: 'Users', count: '2,847', icon: '👥' },
  { id: 'products', label: 'Products', count: '194', icon: '📦' },
  { id: 'orders', label: 'Orders', count: '1,203', icon: '🛒' },
  { id: 'analytics', label: 'Analytics', count: '30 days', icon: '📊' },
];

export function ImportExportPage() {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedDataset, setSelectedDataset] = useState('users');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 120));
      setExportProgress(i);
    }
    setExporting(false);
    setExportProgress(0);
    toast.success(`${selectedDataset}.${selectedFormat} exported successfully!`);
  };

  const handleImport = (files: FileList | null) => {
    if (!files?.length) return;
    toast.success(`${files[0].name} imported successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Import / Export</h1>
        <p className="text-sm text-muted-foreground mt-1">Transfer data in and out of the system</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Data
            </CardTitle>
            <CardDescription>Download your data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Dataset selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Dataset</p>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_DATASETS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDataset(d.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all text-sm ${
                      selectedDataset === d.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="text-base">{d.icon}</span>
                    <div>
                      <p className="font-medium">{d.label}</p>
                      <p className="text-xs text-muted-foreground">{d.count} records</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Export Format</p>
              <div className="space-y-2">
                {EXPORT_FORMATS.map(f => (
                  <label
                    key={f.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFormat === f.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={f.id}
                      checked={selectedFormat === f.id}
                      onChange={() => setSelectedFormat(f.id)}
                      className="accent-primary"
                    />
                    <div>
                      <p className="text-sm font-medium">{f.label}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {exporting && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Exporting…</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            <Button onClick={handleExport} disabled={exporting} className="w-full">
              {exporting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting…</>
              ) : (
                <><Download className="mr-2 h-4 w-4" />Export {selectedDataset}.{selectedFormat}</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Import Data
            </CardTitle>
            <CardDescription>Upload files to import data into the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleImport(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
            >
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports CSV, JSON, XLSX (max 50MB)</p>
              <label className="mt-4 inline-block cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.json,.xlsx"
                  className="hidden"
                  onChange={e => handleImport(e.target.files)}
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <FileText className="h-4 w-4" />
                  Browse Files
                </span>
              </label>
            </div>

            {/* Import guidelines */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Import Guidelines</p>
              <div className="space-y-1.5">
                {[
                  { ok: true,  text: 'CSV files must include a header row' },
                  { ok: true,  text: 'JSON must be an array of objects' },
                  { ok: true,  text: 'Duplicate records will be skipped' },
                  { ok: false, text: 'Files over 50MB are not supported' },
                ].map(({ ok, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    {ok
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      : <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    }
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent imports */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Imports</p>
              {[
                { file: 'users_jan2026.csv', date: '2 hours ago', status: 'success', records: 142 },
                { file: 'products_bulk.json', date: '1 day ago', status: 'success', records: 38 },
                { file: 'orders_q4.xlsx', date: '3 days ago', status: 'failed', records: 0 },
              ].map(item => (
                <div key={item.file} className="flex items-center justify-between p-2.5 rounded-lg border text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.file}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <Badge
                    className={`shrink-0 text-xs ${
                      item.status === 'success'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {item.status === 'success' ? `${item.records} records` : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
