import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Lightbulb, Package, Plus, Clock, Users, ThumbsUp, Calendar, ExternalLink } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  expected_days: number;
  creator_email: string;
  created_at: string;
  claims_count?: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  creator_email: string;
  actual_days: number;
  product_url?: string;
  image_url?: string;
  created_at: string;
  dwfm_count?: number;
  idea_id?: string;
}

// Calculate product price based on actual days and claims
const calculatePrice = (actualDays: number, claimsCount: number = 0): number => {
  const basePrice = actualDays * 10; // 10 points per day
  const supplyDiscount = claimsCount > 1 ? 0.9 : 1; // 10% off if multiple people built it
  return Math.round(basePrice * supplyDiscount);
};

type Tab = 'ideas' | 'products';

export const StoreApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  // Form states
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    expected_days: 7
  });

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    actual_days: 7,
    product_url: '',
    idea_id: ''
  });

  useEffect(() => {
    fetchIdeas();
    fetchProducts();
  }, []);

  const fetchIdeas = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      // Fetch ideas with claims count
      const { data: ideasData, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch claims count for each idea
      const ideasWithCounts = await Promise.all(
        (ideasData || []).map(async (idea) => {
          const { count } = await supabase
            .from('claims')
            .select('*', { count: 'exact', head: true })
            .eq('idea_id', idea.id);
          return { ...idea, claims_count: count || 0 };
        })
      );

      setIdeas(ideasWithCounts);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!supabase) return;
    try {
      // Fetch products with DWFM count
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch DWFM count for each product
      const productsWithCounts = await Promise.all(
        (productsData || []).map(async (product) => {
          const { count } = await supabase
            .from('does_work_for_me')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id);
          return { ...product, dwfm_count: count || 0 };
        })
      );

      setProducts(productsWithCounts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;

    try {
      const { error } = await supabase.from('ideas').insert({
        title: newIdea.title,
        description: newIdea.description,
        expected_days: newIdea.expected_days,
        creator_id: user.id,
        creator_email: user.email
      });

      if (error) throw error;

      setNewIdea({ title: '', description: '', expected_days: 7 });
      setShowIdeaForm(false);
      fetchIdeas();
    } catch (error) {
      console.error('Error creating idea:', error);
      alert('Failed to create idea');
    }
  };

  const handleClaimIdea = async (ideaId: string) => {
    if (!supabase || !user) {
      alert('Please sign in to claim an idea');
      return;
    }

    try {
      const { error } = await supabase.from('claims').insert({
        idea_id: ideaId,
        user_id: user.id,
        user_email: user.email
      });

      if (error) {
        if (error.code === '23505') {
          alert('You have already claimed this idea');
        } else {
          throw error;
        }
      } else {
        alert('Idea claimed! Good luck building it!');
        fetchIdeas();
      }
    } catch (error) {
      console.error('Error claiming idea:', error);
      alert('Failed to claim idea');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;

    try {
      const { error } = await supabase.from('products').insert({
        title: newProduct.title,
        description: newProduct.description,
        actual_days: newProduct.actual_days,
        product_url: newProduct.product_url || null,
        idea_id: newProduct.idea_id || null,
        creator_id: user.id,
        creator_email: user.email
      });

      if (error) throw error;

      setNewProduct({ title: '', description: '', actual_days: 7, product_url: '', idea_id: '' });
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
  };

  const handleDoesWorkForMe = async (productId: string) => {
    if (!supabase || !user) {
      alert('Please sign in to vote');
      return;
    }

    try {
      const { error } = await supabase.from('does_work_for_me').insert({
        product_id: productId,
        user_id: user.id,
        user_email: user.email
      });

      if (error) {
        if (error.code === '23505') {
          alert('You have already voted for this product');
        } else {
          throw error;
        }
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="h-full bg-ph-beige overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b-2 border-ph-black p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          {/* Left: Toggle Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'ideas' ? 'products' : 'ideas')}
            className={`px-4 py-2 font-bold border-2 border-ph-black transition-all ${
              activeTab === 'ideas'
                ? 'bg-ph-blue text-white shadow-retro'
                : 'bg-ph-orange text-white shadow-retro'
            } hover:shadow-retro hover:-translate-y-0.5`}
          >
            {activeTab === 'ideas' ? (
              <>
                <Package className="inline mr-2" size={18} />
                View Product Shelf
              </>
            ) : (
              <>
                <Lightbulb className="inline mr-2" size={18} />
                View Idea Vault
              </>
            )}
          </button>

          {/* Center: Title */}
          <h1 className="text-2xl font-bold">
            {activeTab === 'products' ? 'Product Shelf' : 'Idea Vault'}
          </h1>

          {/* Right: Action Button */}
          {user && (
            <button
              onClick={() => activeTab === 'ideas' ? setShowIdeaForm(!showIdeaForm) : setShowProductForm(!showProductForm)}
              className="px-4 py-2 bg-ph-green text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold"
            >
              <Plus className="inline mr-2" size={18} />
              {activeTab === 'ideas' ? 'Share an Idea' : 'List a Product'}
            </button>
          )}
        </div>

        {/* Subtitle / Description */}
        <p className="text-sm font-mono text-gray-600 text-center">
          {activeTab === 'products'
            ? '🛍️ Browse completed products built by the community'
            : '💡 Ideas don\'t belong to you. They belong to whoever builds them.'}
        </p>
      </div>

      <div className="p-6">
        {/* Idea Form */}
        {showIdeaForm && user && (
          <div className="mb-6 bg-white border-2 border-ph-black p-6 shadow-retro">
            <h3 className="font-bold text-lg mb-4">Share a New Idea</h3>
            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                  placeholder="A productivity tool for..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                  placeholder="Describe the idea in detail..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Expected Build Time</label>
                <select
                  value={newIdea.expected_days}
                  onChange={(e) => setNewIdea({ ...newIdea, expected_days: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={21}>21 days</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro font-bold"
                >
                  Share Idea
                </button>
                <button
                  type="button"
                  onClick={() => setShowIdeaForm(false)}
                  className="px-4 py-2 bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Form */}
        {showProductForm && user && (
          <div className="mb-6 bg-white border-2 border-ph-black p-6 shadow-retro">
            <h3 className="font-bold text-lg mb-4">Upload a Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Actual Build Time (days)</label>
                <input
                  type="number"
                  value={newProduct.actual_days}
                  onChange={(e) => setNewProduct({ ...newProduct, actual_days: parseInt(e.target.value) })}
                  required
                  min={1}
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Product URL (optional)</label>
                <input
                  type="url"
                  value={newProduct.product_url}
                  onChange={(e) => setNewProduct({ ...newProduct, product_url: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-ph-orange text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro font-bold"
                >
                  Upload Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-4 py-2 bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content */}
        {activeTab === 'ideas' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 font-mono">Loading ideas...</div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-8 bg-white border-2 border-ph-black p-6">
                <Lightbulb size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-gray-600">No ideas yet. Be the first to share one!</p>
              </div>
            ) : (
              ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white border-2 border-ph-black p-6 shadow-retro-sm hover:shadow-retro transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{idea.title}</h3>
                    <div className="flex gap-2 items-center text-sm font-mono">
                      <Clock size={16} />
                      <span>{idea.expected_days}d</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 font-mono text-sm">{idea.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm font-mono text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {idea.claims_count} claimed
                      </span>
                      <span className="text-xs">by {idea.creator_email}</span>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleClaimIdea(idea.id)}
                        className="px-4 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold text-sm"
                      >
                        Claim & Build
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 font-mono">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-white border-2 border-ph-black p-6">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-gray-600">No products yet. Upload the first one!</p>
              </div>
            ) : (
              products.map((product) => {
                const price = calculatePrice(product.actual_days, 0); // TODO: get claims count
                return (
                  <div
                    key={product.id}
                    className="bg-gradient-to-b from-white to-ph-beige border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-2 transition-all flex flex-col relative group"
                  >
                    {/* Book/Product Cover */}
                    <div className="aspect-[3/4] bg-white border-b-2 border-ph-black p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Package size={48} className="mx-auto mb-2 text-ph-orange" />
                          <h3 className="font-bold text-sm leading-tight px-2">{product.title}</h3>
                        </div>
                      )}

                      {/* Hover overlay with details */}
                      <div className="absolute inset-0 bg-ph-black/90 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between text-xs">
                        <div>
                          <h3 className="font-bold mb-2">{product.title}</h3>
                          <p className="text-xs leading-tight mb-2 line-clamp-4">{product.description}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span>Built in {product.actual_days} days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp size={12} />
                            <span>{product.dwfm_count} votes</span>
                          </div>
                          <div className="text-xs opacity-75 truncate">by {product.creator_email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Shelf label with price */}
                    <div className="p-2 bg-white border-t-2 border-ph-black">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate">{product.title}</h4>
                          <p className="text-xs text-gray-500 font-mono truncate">{product.actual_days}d build</p>
                        </div>
                        {product.product_url && (
                          <a
                            href={product.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ph-blue hover:text-ph-blue/80 ml-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      {/* Price tag */}
                      <div className="bg-ph-orange text-white px-2 py-1 text-center font-bold text-sm border-2 border-ph-black mb-2">
                        {price} pts
                      </div>

                      {user && (
                        <button
                          onClick={() => handleDoesWorkForMe(product.id)}
                          className="w-full px-2 py-1.5 bg-ph-green text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-0.5 transition-all font-bold text-xs"
                          title="Mark this product as useful"
                        >
                          <ThumbsUp className="inline mr-1" size={12} />
                          It Works
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
