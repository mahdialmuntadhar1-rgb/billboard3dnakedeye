/**
 * Posts Service layer separating application presentation code from API interactions.
 * Integrates social feed activities for business owners including likes and comments.
 * Features a persistent local sandbox adapter fallback in mock-mode.
 */

import { ApiClient } from './apiClient';
import { Post, PostComment } from '../types';

// Let's create an in-memory cache of mock posts initialized with some elegant starting profiles
const INITIAL_MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    authorName: 'Karim Zayed',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    authorRole: 'owner',
    content: 'Excited to announce our new boutique workspace layout is officially open! Enjoy customized ergonomic seating, high-speed fiber channels, and unlimited specialty Arabic coffee to fuel your daily project sprints. Drop by for a preview tour this afternoon!',
    contentAr: 'يسعدني الإعلان عن الافتتاح الرسمي لمساحات العمل الحرفية الجديدة! استمتع بمقاعد مريحة مخصصة، وقنوات ألياف ضوئية فائقة السرعة، وقهوة عربية فاخرة غير محدودة لتغذية مشاريعك اليومية. تفضل بزيارتنا للقيام بجولة استكشافية بعد ظهر اليوم!',
    contentKu: 'زۆر خۆشحاڵین بە ڕاگەیاندنی فەرمی کردنەوەی نوێترین شوێنی کارمان! چێژ لە کورسی نوێ، هێڵی ئینتەرنێتی خێرا، و قاوەی نایاب وەربگرە. سەردانمان بکە بۆ بینینی تەواوی پڕۆژەکە!',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
    likes: ['layla@explorer.com'],
    comments: [
      {
        id: 'pc_1',
        authorName: 'Layla Al-Mansoori',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        text: 'The layout looks incredibly professional Karim! Can’t wait to book a desk tomorrow.',
        date: '2 hours ago'
      }
    ],
    isVerified: true,
    date: '2 hours ago'
  },
  {
    id: 'p_2',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    authorRole: 'admin',
    content: 'We have updated our core community guidelines to maintain a high-trust verification process for our registered directory partners. Looking forward to auditing the next batch of elite local businesses this week!',
    contentAr: 'لقد قمنا بتحديث إرشادات المجتمع الأساسية لدينا للحفاظ على عملية تحقق عالية الموثوقية لشركاء الدليل المسجلين لدينا. نتطلع إلى مراجعة الدفعة التالية من الشركات المحلية المتميزة هذا الأسبوع!',
    contentKu: 'ڕێنمایی نوێمان بۆ بەشداربووان داناوە بۆ خێراکردنی کارەکان. زۆر شادمانین بە بینینی کارە نوێیەکان.',
    likes: [],
    comments: [],
    isVerified: true,
    date: '5 hours ago'
  }
];

// Read from session storage to maintain posts updates across browser refreshes
function getPersistedPosts(): Post[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_POSTS;
  const saved = localStorage.getItem('bep_social_posts');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_MOCK_POSTS;
    }
  }
  localStorage.setItem('bep_social_posts', JSON.stringify(INITIAL_MOCK_POSTS));
  return INITIAL_MOCK_POSTS;
}

function savePosts(posts: Post[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bep_social_posts', JSON.stringify(posts));
}

export const PostsService = {
  /**
   * Fetches all feeds/posts matching community trends.
   */
  async fetchPosts(): Promise<Post[]> {
    if (ApiClient.isMockMode) {
      // Simulate minimal network latency
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getPersistedPosts();
    }

    try {
      return await ApiClient.get<Post[]>('/api/posts');
    } catch (err) {
      console.warn('⚠️ Fetch posts API error, returning persisted mock feed:', err);
      return getPersistedPosts();
    }
  },

  /**
   * Submits a new feed post under a business owner profile.
   */
  async createPost(postData: { 
    authorName: string; 
    authorAvatar: string; 
    content: string; 
    authorRole?: any;
    image?: string;
    bgStyle?: 'default' | 'dark-cosmos' | 'warm-sepia' | 'sunset-sherbet';
    layoutMode?: 'standard' | 'bento' | 'hero-compact' | 'gold-accent';
    aspectRatio?: 'square' | 'portrait' | 'widescreen';
  }): Promise<Post> {
    if (ApiClient.isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const posts = getPersistedPosts();
      const newPost: Post = {
        id: `p_${Date.now()}`,
        authorName: postData.authorName,
        authorAvatar: postData.authorAvatar,
        authorRole: postData.authorRole || 'user',
        content: postData.content,
        contentAr: postData.content, // simple reflection for placeholder
        image: postData.image,
        bgStyle: postData.bgStyle || 'default',
        layoutMode: postData.layoutMode || 'standard',
        aspectRatio: postData.aspectRatio || 'widescreen',
        likes: [],
        comments: [],
        isVerified: postData.authorRole === 'owner' || postData.authorRole === 'admin',
        date: 'Just now'
      };
      
      const updated = [newPost, ...posts];
      savePosts(updated);
      return newPost;
    }

    try {
      return await ApiClient.post<Post>('/api/posts', postData);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Toggles the thumbs-up/like state on a social feed card.
   */
  async toggleLike(postId: string, userEmail: string): Promise<Post> {
    if (ApiClient.isMockMode) {
      const posts = getPersistedPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        const post = posts[postIndex];
        const isLiked = post.likes.includes(userEmail);
        const updatedLikes = isLiked
          ? post.likes.filter((email) => email !== userEmail)
          : [...post.likes, userEmail];
        
        const updatedPost = { ...post, likes: updatedLikes };
        posts[postIndex] = updatedPost;
        savePosts(posts);
        return updatedPost;
      }
      throw new Error('Post not found');
    }

    try {
      return await ApiClient.post<Post>(`/api/posts/${postId}/like`, { email: userEmail });
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Submits a textual commentary response under a social post card.
   */
  async submitComment(postId: string, commentData: { authorName: string; authorAvatar: string; text: string }): Promise<PostComment> {
    if (ApiClient.isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const posts = getPersistedPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        const post = posts[postIndex];
        const newComment: PostComment = {
          id: `pc_${Date.now()}`,
          authorName: commentData.authorName,
          authorAvatar: commentData.authorAvatar,
          text: commentData.text,
          date: 'Just now'
        };
        
        post.comments.push(newComment);
        savePosts(posts);
        return newComment;
      }
      throw new Error('Post not found');
    }

    try {
      return await ApiClient.post<PostComment>(`/api/posts/${postId}/comments`, commentData);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  }
};
