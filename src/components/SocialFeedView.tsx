import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { PostsService } from '../services/posts';
import { Post, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Image as ImageIcon, 
  Video as VideoIcon,
  ShieldCheck, 
  Sparkles, 
  Trash2,
  Lock,
  MessageSquareOff,
  Share2,
  Film
} from 'lucide-react';

interface SocialFeedViewProps {
  lang: Language;
  onSuccess: (en: string, ar: string, type?: 'success' | 'info' | 'error') => void;
}

const STOCK_CREATIVE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=600', name: 'Boardroom Brainstorm' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', name: 'Ergonomic Workspace' },
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600', name: 'Design Sprint Hub' },
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600', name: 'Team Collaboration' }
];

const STOCK_CREATIVE_VIDEOS = [
  { url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-space-with-employees-40192-large.mp4', name: 'Elite Office Life' },
  { url: 'https://assets.mixkit.co/videos/preview/mixkit-cup-of-coffee-with-latte-art-on-a-table-40195-large.mp4', name: 'Bistro Latte Art' },
  { url: 'https://assets.mixkit.co/videos/preview/mixkit-interior-design-of-a-luxury-living-room-40244-large.mp4', name: 'Luxury Atrium Architectural Layout' }
];

export const SocialFeedView: React.FC<SocialFeedViewProps> = ({ lang, onSuccess }) => {
  const { user } = useAuth();
  const { isRTL } = useApp();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Post States
  const [newContent, setNewContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('image');
  const [selectedStockImg, setSelectedStockImg] = useState('');
  const [customImgUrl, setCustomImgUrl] = useState('');
  
  // Custom Visual Themes & Layout parameters
  const [bgStyle, setBgStyle] = useState<'default' | 'dark-cosmos' | 'warm-sepia' | 'sunset-sherbet'>('default');
  const [layoutMode, setLayoutMode] = useState<'standard' | 'bento' | 'hero-compact' | 'gold-accent'>('standard');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'widescreen'>('widescreen');

  // Video States
  const [selectedStockVideo, setSelectedStockVideo] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Comments accordion state
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const result = await PostsService.fetchPosts();
      setPosts(result);
    } catch (err) {
      console.error(err);
      onSuccess('Cannot fetch social announcements.', 'تعذر جلب إعلانات المعرض الاجتماعي.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newContent.trim()) {
      onSuccess(
        'Please enter a statement for your workspace audience.',
        'الرجاء إدخال تفاصيل المنشور لمشاركتها مع جمهورك.',
        'error'
      );
      return;
    }

    setIsPublishing(true);
    try {
      let finalMedia: string | undefined = undefined;
      
      if (mediaType === 'image') {
        finalMedia = customImgUrl.trim() || selectedStockImg || undefined;
      } else if (mediaType === 'video') {
        finalMedia = customVideoUrl.trim() || selectedStockVideo || undefined;
      }

      const created = await PostsService.createPost({
        authorName: user.name,
        authorAvatar: user.avatar,
        authorRole: user.role,
        content: newContent,
        image: finalMedia,
        bgStyle: bgStyle,
        layoutMode: layoutMode,
        aspectRatio: aspectRatio
      });

      setPosts((prev) => [created, ...prev]);
      setNewContent('');
      setSelectedStockImg('');
      setCustomImgUrl('');
      setSelectedStockVideo('');
      setCustomVideoUrl('');
      setBgStyle('default');
      setLayoutMode('standard');
      setAspectRatio('widescreen');
      onSuccess('Announcement published to local registry users!', 'تم نشر الإعلان بنجاح في المعرض العام!', 'success');
    } catch (err) {
      console.error(err);
      onSuccess('Failed to upload announcement.', 'فشل تحميل وبث الإعلان.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!user) {
      onSuccess('Please log in first to support this business!', 'الرجاء تسجيل الدخول أولاً لدعم هذا الشريك!', 'info');
      return;
    }

    try {
      const updated = await PostsService.toggleLike(postId, user.email);
      setPosts((prev) => prev.map((p) => p.id === postId ? updated : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) {
      onSuccess('Please log in first to leave feedback.', 'الرجاء تسجيل الدخول أولاً لإبداء رأيك وتعليقك.', 'info');
      return;
    }

    const text = commentInput[postId] || '';
    if (!text.trim()) return;

    try {
      const comment = await PostsService.submitComment(postId, {
        authorName: user.name,
        authorAvatar: user.avatar,
        text: text
      });

      setPosts((prev) => prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, comment]
          };
        }
        return p;
      }));

      setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error(err);
      onSuccess('Failed to post comments.', 'فشل إرسال التعليق.', 'error');
    }
  };

  const handleShare = (post: Post) => {
    const postSnippet = post.content.slice(0, 45) + '...';
    try {
      const shareUrl = `${window.location.origin}/?tab=social&post=${post.id}`;
      navigator.clipboard.writeText(shareUrl);
      onSuccess(
        'Post reference link copied successfully!',
        'تم نسخ رابط الإشارة للإعلان الاجتماعي بنجاح في الحافظة!',
        'success'
      );
    } catch {
      onSuccess(
        `Announcement: ${postSnippet}`,
        `تعليق المعرض: ${postSnippet}`,
        'info'
      );
    }
  };

  const toggleCommentsView = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.includes('.mp4?') || url.includes('video') || url.includes('mixkit.co/videos');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* 1. Header announcement banner */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/25 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>{lang === 'en' ? 'Community Ledger' : 'ساحة أخبار الشركات المسجلة'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-display font-bold tracking-tight">
            {lang === 'en' ? 'Social Announcements Channel' : 'المنبر الاجتماعي للمنشآت'}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            {lang === 'en' 
              ? 'Stay closely aligned with current local updates, new workspace layout rollouts, and chef specials published directly by verified corporate managers.'
              : 'ابقَ على صلة تامة بالتحديثات اليومية والمشاريع المبتكرة التي يبثها شركاؤنا الموثقون بشكل فوري.'
            }
          </p>
        </div>
      </div>

      {/* 2. Create announcement Card */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm">
        {user ? (
          <form onSubmit={handleCreatePost} className="p-5 sm:p-6 space-y-5">
              <div className="flex gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full bg-zinc-100 object-cover border border-zinc-200 shadow-sm"
                />
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-zinc-900 w-full block">
                    {lang === 'en' ? `Publish as ${user.name}` : `النشر باسم ${user.name}`}
                  </span>
                  <div className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 leading-none ${
                    user.role === 'admin' ? 'text-rose-600' : user.role === 'owner' ? 'text-amber-600' : 'text-zinc-500'
                  }`}>
                    <ShieldCheck className={`w-3.5 h-3.5 ${
                      user.role === 'admin' ? 'text-rose-500' : user.role === 'owner' ? 'text-amber-500' : 'text-zinc-400'
                    }`} />
                    <span>
                      {user.role === 'admin' 
                        ? (lang === 'en' ? 'Platform Administrator' : 'مدير المنصة')
                        : user.role === 'owner' 
                          ? (lang === 'en' ? 'Verified Business Partner' : 'شريك عمل موثق')
                          : (lang === 'en' ? 'Community Explorer' : 'مستكشف محلي')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Area content input */}
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                placeholder={lang === 'en' ? "What's on your mind? Share your thoughts, cafes, or workspace layout reviews..." : "ماذا يدور في ذهنك اليوم؟ شارك الكافيه المفضل لديك، أو تجربتك في استكشاف الشركات..."}
                className="w-full bg-stone-50/50 border border-zinc-200 rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-normal placeholder:text-zinc-400"
              />

              {/* Visual Post Customization Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-zinc-150 bg-stone-50/50 p-4 rounded-2xl">
                {/* 1. Background Style Picker */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block font-mono">
                    {lang === 'en' ? 'Backdrop Theme' : 'مظهر وثمات الكارت'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(['default', 'dark-cosmos', 'warm-sepia', 'sunset-sherbet'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setBgStyle(style)}
                        className={`px-2 py-1 text-[8px] font-bold rounded-lg cursor-pointer transition-all border ${
                          bgStyle === style
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                            : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                        }`}
                      >
                        {style === 'default' ? 'Classic' : style === 'dark-cosmos' ? 'Cosmos' : style === 'warm-sepia' ? 'Sepia' : 'Sunset'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Layout Blueprint Picker */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block font-mono">
                    {lang === 'en' ? 'Structural Accent' : 'نوع تخطيط الكارد'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(['standard', 'bento', 'hero-compact', 'gold-accent'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setLayoutMode(mode)}
                        className={`px-2 py-1 text-[8px] font-bold rounded-lg cursor-pointer transition-all border ${
                          layoutMode === mode
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                            : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                        }`}
                      >
                        {mode === 'standard' ? 'Standard' : mode === 'bento' ? 'Bento' : mode === 'hero-compact' ? 'Spotlight' : 'Gold Rim'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Aspect Ratio Picker */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block font-mono">
                    {lang === 'en' ? 'Media Size Ratio' : 'أبعاد عرض المرفقات'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(['widescreen', 'square', 'portrait'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-2 py-1 text-[8px] font-bold rounded-lg cursor-pointer transition-all border ${
                          aspectRatio === ratio
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                            : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                        }`}
                      >
                        {ratio === 'widescreen' ? '16:9' : ratio === 'square' ? '1:1' : '4:5'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Media Upload toggle headers */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {lang === 'en' ? 'Attachment Type' : 'نوع المرفق الترويجي'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-colors ${
                        mediaType === 'image'
                          ? 'bg-zinc-950 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {lang === 'en' ? 'Photo' : 'صورة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-colors ${
                        mediaType === 'video'
                          ? 'bg-zinc-950 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {lang === 'en' ? 'Video / Reel' : 'فيديو / ريل'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('none')}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-colors ${
                        mediaType === 'none'
                          ? 'bg-zinc-950 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {lang === 'en' ? 'Text Only' : 'نص فقط'}
                    </button>
                  </div>
                </div>
                
                {/* Image upload selector choice */}
                {mediaType === 'image' && (
                  <div className="space-y-3 p-1.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block px-1">
                      {lang === 'en' ? 'Select Showcase Photography' : 'اختر صورة من المعرض الإبداعي'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STOCK_CREATIVE_IMAGES.map((img) => {
                        const isSelected = selectedStockImg === img.url;
                        return (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => {
                              setSelectedStockImg(isSelected ? '' : img.url);
                              setCustomImgUrl('');
                            }}
                            className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all text-left cursor-pointer ${
                              isSelected ? 'border-amber-500 scale-[1.03] shadow-inner' : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 p-1">
                              <span className="text-[8px] text-white font-semibold truncate block">{img.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="relative mt-1">
                      <span className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-3'} flex items-center text-zinc-400`}>
                        <ImageIcon className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="url"
                        value={customImgUrl}
                        onChange={(e) => {
                          setCustomImgUrl(e.target.value);
                          setSelectedStockImg('');
                        }}
                        placeholder={lang === 'en' ? "Or enter a custom photo URL link..." : "أو أدخل رابط صورة مخصص مباشر..."}
                        className={`w-full py-2.5 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-medium`}
                      />
                    </div>
                  </div>
                )}

                {/* Video upload selector choice */}
                {mediaType === 'video' && (
                  <div className="space-y-3 p-1.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-450 block px-1 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-zinc-650" />
                      <span>{lang === 'en' ? 'Select High-Fidelity Reel' : 'اختر مقطع فيديو / ريل ترويجي'}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {STOCK_CREATIVE_VIDEOS.map((vid) => {
                        const isSelected = selectedStockVideo === vid.url;
                        return (
                          <button
                            key={vid.url}
                            type="button"
                            onClick={() => {
                              setSelectedStockVideo(isSelected ? '' : vid.url);
                              setCustomVideoUrl('');
                            }}
                            className={`group relative p-2.5 bg-white border rounded-xl text-left cursor-pointer transition-all ${
                              isSelected ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-200 hover:border-zinc-800'
                            }`}
                          >
                            <div className="text-[10px] font-bold text-zinc-900 block truncate">{vid.name}</div>
                            <div className="text-[8px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">Ready MP4 Asset</div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="relative mt-1">
                      <span className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-3'} flex items-center text-zinc-400`}>
                        <VideoIcon className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="url"
                        value={customVideoUrl}
                        onChange={(e) => {
                          setCustomVideoUrl(e.target.value);
                          setSelectedStockVideo('');
                        }}
                        placeholder={lang === 'en' ? "Or enter a custom MP4 video URL (e.g. from Cloud storage)..." : "أو أدخل رابط فيديو MP4 مستقل..."}
                        className={`w-full py-2.5 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-medium`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit panel */}
              <div className="flex justify-end pt-2.5 border-t border-zinc-100">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>{lang === 'en' ? 'Publishing...' : 'جاري النشر...'}</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Broadcast Announcement' : 'بث الإعلان العام'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <Lock className="w-10 h-10 text-zinc-300 w-full text-center mx-auto" />
              <h3 className="text-zinc-900 font-display font-semibold text-sm uppercase tracking-widest leading-none">
                {lang === 'en' ? 'Announcements Desk Closed' : 'ميزة النشر مقفلة'}
              </h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed font-medium">
                {lang === 'en'
                  ? 'Posting capability is exclusive to verified business owners in the registry directory. Use our demo credentials layout above to log in as "Karim Zayed".'
                  : 'تقتصر إمكانية بث المنشورات على شركاء الأعمال المسجلين والمدققين من قبل المشرفين.'
                }
              </p>
            </div>
          )
        ) : (
          <div className="p-8 text-center space-y-4">
            <Lock className="w-10 h-10 text-zinc-300 w-full text-center mx-auto" />
            <h3 className="text-zinc-900 font-display font-semibold text-sm uppercase tracking-widest leading-none">
              {lang === 'en' ? 'Announcements Restricted' : 'شريط اجتماعي مقيد'}
            </h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed font-medium">
              {lang === 'en'
                ? 'Please authorize through our Sign-In system to participate alongside owners and explore workspace updates.'
                : 'يرجى تسجيل الدخول وإثبات هويتك الاستكشافية للمشاركة والتفاعل.'
              }
            </p>
          </div>
        )}
      </div>

      {/* 3. Feeds loop registry */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-zinc-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-200 rounded w-1/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/6" />
                </div>
              </div>
              <div className="h-4 bg-zinc-150 rounded w-5/6" />
              <div className="h-60 bg-zinc-200 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-zinc-200 rounded-3xl space-y-4">
          <MessageSquareOff className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="font-display font-semibold text-zinc-900 text-lg">
            {lang === 'en' ? 'Empty Community Feed' : 'المعرض الاجتماعي فارغ'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            {lang === 'en' 
              ? 'Be the first registered business partner to kickstart the community board!'
              : 'كن أول شريك ينشر تحديثاته هنا لتفعيل المعرض الاجتماعي اليوم.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const hasLiked = user ? post.likes.includes(user.email) : false;
            const commentsOpen = expandedComments[post.id] || false;
            const activeCommentText = commentInput[post.id] || '';
            const isVideo = isVideoUrl(post.image);

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
              >
                {/* Header segment of card */}
                <div className="p-5 flex items-center justify-between border-b border-zinc-100">
                  <div className="flex gap-3 items-center">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-10 h-10 rounded-full object-cover bg-zinc-100 border border-zinc-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-900">{post.authorName}</span>
                        {post.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-500/10" title="Verified Business Account" />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-400 block tracking-wide mt-0.5">
                        {post.date}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-zinc-100 text-zinc-650 rounded-md">
                    {post.authorRole === 'admin' ? 'Admin' : 'Partner'}
                  </span>
                </div>

                {/* Content body segment */}
                <div className="p-5 space-y-4">
                  <p className="text-zinc-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                    {lang === 'ar' && post.contentAr ? post.contentAr : (lang === 'ku' && post.contentKu ? post.contentKu : post.content)}
                  </p>

                  {/* Media container: Conditional selection for images or high-end HTML5 players */}
                  {post.image && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/80">
                      {isVideo ? (
                        <video 
                          src={post.image} 
                          controls 
                          playsInline 
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={post.image} 
                          alt="Directory post illustration preview" 
                          className="w-full h-full object-cover select-none" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}

                  {/* Interaction bar controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-zinc-600 text-xs font-semibold">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-stone-50 transition-all cursor-pointer ${
                          hasLiked ? 'text-rose-600 bg-rose-50/50' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-600' : ''}`} />
                        <span>{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() => toggleCommentsView(post.id)}
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-stone-50 transition-all cursor-pointer ${
                          commentsOpen ? 'bg-zinc-50 text-zinc-950' : ''
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 text-zinc-500" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-stone-50 text-zinc-550 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-zinc-500" />
                      <span>{lang === 'en' ? 'Share' : 'مشاركة'}</span>
                    </button>
                  </div>
                </div>

                {/* Comments section tray */}
                {commentsOpen && (
                  <div className="bg-stone-50/60 border-t border-zinc-100 p-5 space-y-4">
                    {/* Comments Loop list */}
                    {post.comments.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2.5 items-start">
                            <img 
                              src={comment.authorAvatar} 
                              alt={comment.authorName} 
                              className="w-7 h-7 rounded-full object-cover border border-zinc-200 shrink-0"
                            />
                            <div className="bg-white border border-zinc-150 p-3 rounded-2xl shadow-xs flex-1 text-left">
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="text-[10px] font-bold text-zinc-900 block">{comment.authorName}</span>
                                <span className="text-[9px] text-zinc-400 block tracking-wide">{comment.date}</span>
                              </div>
                              <p className="text-zinc-700 text-xs mt-1.5 leading-relaxed font-normal">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                        {lang === 'en' ? 'No replies yet' : 'لا توجد تعليقات بعد'}
                      </p>
                    )}

                    {/* Post a reply Form */}
                    {user ? (
                      <div className="flex gap-2 items-center pt-2 border-t border-zinc-100">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover bg-zinc-100 border border-zinc-150"
                        />
                        <div className="flex-1 relative flex items-center">
                          <input
                            type="text"
                            value={activeCommentText}
                            onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder={lang === 'en' ? 'Leave an active feedback comment...' : 'اكتب تعليقك البناء هنا...'}
                            className="w-full bg-white border border-zinc-250 border-zinc-200 rounded-xl py-2 pl-3.5 pr-10 text-xs focus:outline-none focus:border-zinc-900 font-medium"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} text-zinc-400 hover:text-zinc-900`}
                          >
                            <Send className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {lang === 'en' ? 'Sign in to write comments' : 'سجل الدخول للمشاركة وإضافة تعليق'}
                      </p>
                    )}
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}

    </div>
  );
};
