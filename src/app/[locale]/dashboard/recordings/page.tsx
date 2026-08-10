"use client";

import { useEffect, useState } from "react";
import {
  Film,
  Search,
  Filter,
  Trash2,
  Play,
  Loader2,
  Calendar,
  HardDrive,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { listRecordingsApi, deleteRecordingApi, RecordingApiItem } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ClientRecordingsPage() {
  const [recordings, setRecordings] = useState<RecordingApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [activeMedia, setActiveMedia] = useState<RecordingApiItem | null>(null);

  const fetchRecordings = async () => {
    setLoading(true);
    const res = await listRecordingsApi({
      per_page: 30,
      recording_type: filterType !== "all" ? filterType : undefined,
      search: searchQuery || undefined,
    });

    const items = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? (res.data.data as RecordingApiItem[])
      : [];

    setRecordings(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecordings();
  }, [filterType]);

  const handleDelete = async (id: number | string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا التسجيل؟")) return;
    await deleteRecordingApi(id);
    fetchRecordings();
    if (activeMedia?.id === id) setActiveMedia(null);
  };

  const filtered = recordings.filter((r) => {
    if (!searchQuery) return true;
    const title = String(r.title || r.name || "").toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Film className="size-6 text-primary" />
            <span>سجل التسجيلات والوسائط المحفوظة (Media Recordings)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            عرض وتصفية وتسغيل المقاطع المسجلة بواسطة الكاميرات
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-bold">
          <HardDrive className="size-4" />
          <span>{recordings.length} تسجيل محفوظ</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث باسم التسجيل أو الكاميرا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-input text-xs bg-background font-semibold cursor-pointer"
          >
            <option value="all">جميع الأنواع (All Types)</option>
            <option value="motion">رصد حركة (Motion)</option>
            <option value="continuous">تسجيل مستمر (Continuous)</option>
            <option value="sos">إنذار طوارئ (SOS Alert)</option>
          </select>
        </div>
      </div>

      {/* Media Player Dialog / Preview */}
      {activeMedia && (
        <div className="db-card p-5 border-2 border-primary/40 bg-slate-950 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-sm font-bold truncate">
                {String(activeMedia.title || activeMedia.name || `تسجيل #${activeMedia.id}`)}
              </h3>
            </div>
            <button
              onClick={() => setActiveMedia(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              إغلاق
            </button>
          </div>

          <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.4_0.12_200_/_0.2)_0%,transparent_70%)]" />
            <Play className="size-16 text-primary/80 animate-pulse z-10" />
            <span className="text-xs text-slate-400 mt-2 font-mono z-10">
              معاينة تشغيل الفيديو (Playback Stream Simulation)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
            <span>الكاميرا: {String(activeMedia.camera_name || `كاميرا #${activeMedia.camera_id || 1}`)}</span>
            <span>التاريخ: {String(activeMedia.created_at || "الآن")}</span>
          </div>
        </div>
      )}

      {/* Grid of Recordings */}
      {loading ? (
        <div className="p-16 db-card flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-xs">جاري تحميل التسجيلات...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 db-card text-center space-y-2">
          <AlertTriangle className="size-8 text-amber-500 mx-auto" />
          <div className="text-sm font-bold text-foreground">لا توجد تسجيلات مطابقة</div>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            تأكد من اختيار نوع التصفية المناسب أو التحقق من اتصال الكاميرات
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isSOS = String(item.recording_type || "").toLowerCase() === "sos";
            return (
              <div
                key={String(item.id)}
                className="db-card p-4 space-y-3 hover:border-primary/50 transition-colors flex flex-col justify-between group"
              >
                <div className="aspect-video bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent" />
                  <Play className="size-10 text-white/40 group-hover:text-primary transition-colors z-10" />
                  
                  <span
                    className={cn(
                      "absolute top-2 start-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10",
                      isSOS
                        ? "bg-red-500 text-white"
                        : "bg-primary/20 text-primary border border-primary/30"
                    )}
                  >
                    {item.recording_type || "مقطع حر"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {String(item.title || item.name || `تسجيل #${item.id}`)}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1 font-mono">
                    <Calendar className="size-3" />
                    <span>{String(item.created_at || "الآن")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[--db-border]">
                  <button
                    onClick={() => setActiveMedia(item)}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <Eye className="size-3.5" />
                    <span>تشغيل</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="حذف التسجيل"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
