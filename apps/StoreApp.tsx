import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Lightbulb, Package, Plus, ThumbsUp, Calendar } from 'lucide-react';

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
  app_path?: string;
  image_url?: string;
  created_at: string;
  dwfm_count?: number;
  idea_id?: string;
}

type Tab = 'ideas' | 'products';

export const StoreApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

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
    app_path: '',
    idea_id: ''
  });

  // Initialize FlowTree product if it doesn't exist
  const initializeFlowTree = async () => {
    if (!supabase) return;

    // Check localStorage cache to avoid unnecessary DB queries
    const initialized = localStorage.getItem('flowtree_initialized');
    if (initialized === 'true') return;

    try {
      // Check if FlowTree product already exists
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('title', 'FlowTree 🌳')
        .maybeSingle();

      if (checkError) {
        return;
      }

      // If exists, mark as initialized and return
      if (existing) {
        localStorage.setItem('flowtree_initialized', 'true');
        return;
      }

      // Create FlowTree product only once
      const { error } = await supabase.from('products').insert({
        title: 'FlowTree 🌳',
        description: 'A powerful prototype interaction flow management tool. Features: Interactive flow management with screenshots, Jump hotspots for navigation, Comment markers for annotations, Linear/Parallel layouts, IndexedDB storage for large data, Import/Export in JSON, High-quality preview. Built with pure HTML/CSS/JavaScript, no server required.',
        actual_days: 14,
        product_url: '',
        app_path: '/products/flowtree/app/app.html',
        creator_id: null,
        creator_email: 'system@joeyconnects.world'
      });

      if (!error) {
        localStorage.setItem('flowtree_initialized', 'true');
        fetchProducts(); // Refresh to show FlowTree
      }
    } catch (error) {
      // Silent fail - don't show errors to user
    }
  };

  useEffect(() => {
    fetchIdeas();
    fetchProducts();
    initializeFlowTree();
  }, []);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showProductForm) setShowProductForm(false);
        if (showIdeaForm) setShowIdeaForm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showProductForm, showIdeaForm]);

  const fetchIdeas = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      // Fetch ideas
      const { data: ideasData, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!ideasData || ideasData.length === 0) {
        setIdeas([]);
        return;
      }

      // Fetch all claims counts in one query
      const { data: claimsData } = await supabase
        .from('claims')
        .select('idea_id')
        .in('idea_id', ideasData.map(i => i.id));

      // Build counts map
      const countsMap = (claimsData || []).reduce((acc, claim) => {
        acc[claim.idea_id] = (acc[claim.idea_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Merge counts with ideas
      const ideasWithCounts = ideasData.map(idea => ({
        ...idea,
        claims_count: countsMap[idea.id] || 0
      }));

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
      // Fetch products
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!productsData || productsData.length === 0) {
        setProducts([]);
        return;
      }

      // Fetch all DWFM counts in one query
      const { data: dwfmData } = await supabase
        .from('does_work_for_me')
        .select('product_id')
        .in('product_id', productsData.map(p => p.id));

      // Build counts map
      const countsMap = (dwfmData || []).reduce((acc, vote) => {
        acc[vote.product_id] = (acc[vote.product_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Merge counts with products
      const productsWithCounts = productsData.map(product => ({
        ...product,
        dwfm_count: countsMap[product.id] || 0
      }));

      setProducts(productsWithCounts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user || isSubmittingIdea) return;

    setIsSubmittingIdea(true);
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
    } finally {
      setIsSubmittingIdea(false);
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
    if (!supabase || !user || isSubmittingProduct) return;

    setIsSubmittingProduct(true);
    try {
      const { error } = await supabase.from('products').insert({
        title: newProduct.title,
        description: newProduct.description,
        actual_days: newProduct.actual_days,
        product_url: newProduct.product_url || null,
        app_path: newProduct.app_path || null,
        idea_id: newProduct.idea_id || null,
        creator_id: user.id,
        creator_email: user.email
      });

      if (error) throw error;

      setNewProduct({ title: '', description: '', actual_days: 7, product_url: '', app_path: '', idea_id: '' });
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleUseProduct = (product: Product) => {
    // If app_path exists, open it in iframe or new window
    if (product.app_path) {
      // Open in new window for now (can be changed to iframe later)
      window.open(product.app_path, '_blank', 'width=1200,height=800');
    } else if (product.product_url) {
      // Fallback to external URL
      window.open(product.product_url, '_blank');
    } else {
      alert('No app path or URL available for this product');
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
      {/* Header - Tab Navigation */}
      <div className="bg-white border-b-2 border-ph-black sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'products' ? '#FF9000' : '#ffffff',
                color: activeTab === 'products' ? '#ffffff' : '#1D1D1D',
                border: '2px solid #1D1D1D',
                fontWeight: 'bold',
                boxShadow: activeTab === 'products' ? '4px 4px 0px 0px #1D1D1D' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'ideas' ? '#3C3CFF' : '#ffffff',
                color: activeTab === 'ideas' ? '#ffffff' : '#1D1D1D',
                border: '2px solid #1D1D1D',
                fontWeight: 'bold',
                boxShadow: activeTab === 'ideas' ? '4px 4px 0px 0px #1D1D1D' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Ideas
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowProductForm(false)}>
            <div className="bg-white border-4 border-ph-black p-6 shadow-retro-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Upload a Product</h3>
                <button onClick={() => setShowProductForm(false)} className="text-2xl hover:text-ph-orange">&times;</button>
              </div>
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
                  <label className="block text-sm font-bold mb-2">Build Time (days)</label>
                  <input
                    type="number"
                    value={newProduct.actual_days}
                    onChange={(e) => setNewProduct({ ...newProduct, actual_days: parseInt(e.target.value) })}
                    min={1}
                    required
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
                <div>
                  <label className="block text-sm font-bold mb-2">App Path (optional)</label>
                  <input
                    type="text"
                    value={newProduct.app_path}
                    onChange={(e) => setNewProduct({ ...newProduct, app_path: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-ph-black font-mono"
                    placeholder="/products/your-app/index.html"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="flex-1 px-4 py-2 bg-ph-orange text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingProduct ? 'Uploading...' : 'Upload Product'}
                  </button>
                  <button type="button" onClick={() => setShowProductForm(false)} className="px-4 py-2 bg-white border-2 border-ph-black font-bold hover:bg-gray-100">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Idea Form Modal */}
      {showIdeaForm && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowIdeaForm(false)}>
          <div className="bg-white border-4 border-ph-black p-6 shadow-retro-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Share a New Idea</h3>
              <button onClick={() => setShowIdeaForm(false)} className="text-2xl hover:text-ph-orange">&times;</button>
            </div>
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
                  disabled={isSubmittingIdea}
                  className="flex-1 px-4 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingIdea ? 'Sharing...' : 'Share Idea'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowIdeaForm(false)}
                  className="px-4 py-2 bg-white border-2 border-ph-black font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Content */}
        {activeTab === 'ideas' ? (
          <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Ideas</h2>
                <p className="text-sm text-gray-600 mt-1 font-mono">Community suggestions waiting to be built</p>
              </div>
              {user && (
                <button
                  onClick={() => setShowIdeaForm(!showIdeaForm)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    border: '2px solid #1D1D1D',
                    fontWeight: 'bold',
                    boxShadow: '2px 2px 0px 0px #1D1D1D',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  + New Idea
                </button>
              )}
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12 font-mono">Loading ideas...</div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-ph-black p-6">
                <Lightbulb size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-gray-600">No ideas yet. Be the first to share one!</p>
              </div>
            ) : (
              <div className="bg-white border-2 border-ph-black shadow-retro">
                <table className="w-full">
                  <thead className="bg-ph-beige border-b-2 border-ph-black">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold uppercase">Idea</th>
                      <th className="text-left px-6 py-3 text-xs font-bold uppercase">Description</th>
                      <th className="text-center px-6 py-3 text-xs font-bold uppercase">Time</th>
                      <th className="text-center px-6 py-3 text-xs font-bold uppercase">Claims</th>
                      <th className="text-center px-6 py-3 text-xs font-bold uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {ideas.map((idea, index) => (
                      <tr key={idea.id} className={`border-b border-gray-200 hover:bg-ph-beige/30 ${index % 2 === 0 ? '' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm">{idea.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">{idea.creator_email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          <p className="line-clamp-2">{idea.description}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-2 py-1 bg-ph-orange text-white font-bold text-xs border-2 border-ph-black">
                            {idea.expected_days}d
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-mono">
                          {idea.claims_count || 0}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user && (
                            <button
                              onClick={() => handleClaimIdea(idea.id)}
                              className="px-3 py-1.5 bg-ph-blue text-white border-2 border-ph-black text-xs font-bold hover:shadow-retro-sm transition-all"
                            >
                              Claim
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <p className="text-sm text-gray-600 mt-1 font-mono">Completed projects from the community</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-12 text-gray-500">Loading products...</div>
            ) : (
              <>
                {/* Upload Card - First Position */}
                {user && (
                  <div
                    onClick={() => setShowProductForm(!showProductForm)}
                    className="aspect-square bg-gradient-to-br from-ph-green/10 to-ph-green/5 border-2 border-dashed border-ph-green hover:border-solid hover:shadow-retro hover:-translate-y-2 transition-all flex flex-col items-center justify-center cursor-pointer group relative"
                  >
                    <Plus size={48} className="text-ph-green mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-ph-green text-sm">Upload Product</p>
                    <p className="text-xs text-gray-500 mt-1 px-4 text-center">Share your creation</p>
                  </div>
                )}

                {/* Product Cards */}
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="aspect-square bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-2 transition-all flex flex-col relative group overflow-hidden"
                  >
                    {/* Main Content - Square */}
                    <div className="flex-1 p-4 flex flex-col items-center justify-between">
                      {/* Icon */}
                      <div className="flex-1 flex items-center justify-center">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} className="w-16 h-16 object-contain" />
                        ) : product.title.includes('FlowTree') ? (
                          <div className="text-6xl">🌳</div>
                        ) : (
                          <Package size={48} className="text-ph-orange" />
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-sm text-center line-clamp-2 mb-1">{product.title}</h4>

                      {/* Build Time */}
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span className="font-mono">{product.actual_days} days</span>
                      </div>

                      {/* Buttons - Same Row */}
                      <div className="w-full flex gap-1">
                        {(product.app_path || product.product_url) && (
                          <button
                            onClick={() => handleUseProduct(product)}
                            className="flex-1 px-2 py-1 bg-ph-blue text-white border-2 border-ph-black font-bold text-xs hover:shadow-retro-sm transition-all"
                          >
                            Use
                          </button>
                        )}

                        {user ? (
                          <button
                            onClick={() => handleDoesWorkForMe(product.id)}
                            style={{
                              flex: (product.app_path || product.product_url) ? '1' : 'auto',
                              width: (product.app_path || product.product_url) ? 'auto' : '100%',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#22c55e',
                              color: '#ffffff',
                              border: '2px solid #1D1D1D',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            👍 {product.dwfm_count || 0}
                          </button>
                        ) : (
                          <div style={{
                            flex: (product.app_path || product.product_url) ? '1' : 'auto',
                            width: (product.app_path || product.product_url) ? 'auto' : '100%',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ffffff',
                            border: '2px solid #1D1D1D',
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            textAlign: 'center'
                          }}>
                            🔒 Vote
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover overlay with full description */}
                    <div className="absolute inset-0 bg-ph-black/95 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold mb-2 text-sm">{product.title}</h3>
                        <p className="text-xs leading-tight mb-3 line-clamp-6">{product.description}</p>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          <span>Built in {product.actual_days} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp size={12} />
                          <span>{product.dwfm_count || 0} votes</span>
                        </div>
                        <div className="opacity-75 truncate">by {product.creator_email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
