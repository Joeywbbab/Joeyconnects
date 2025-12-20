// Upload FlowTree as sample product
// Run this in browser console after signing in

async function uploadFlowTree() {
  const { supabase } = window;

  if (!supabase) {
    console.error('Supabase not initialized');
    return;
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('Please sign in first!');
    return;
  }

  console.log('Uploading FlowTree as:', user.email);

  // Upload the product
  const { data, error } = await supabase
    .from('products')
    .insert({
      title: 'FlowTree 🌳',
      description: 'A powerful prototype interaction flow management tool. Features: Interactive flow management with screenshots, Jump hotspots for navigation, Comment markers for annotations, Linear/Parallel layouts, IndexedDB storage for large data, Import/Export in JSON, High-quality preview. Built with pure HTML/CSS/JavaScript, no server required.',
      creator_id: user.id,
      creator_email: user.email,
      actual_days: 14,
      product_url: 'https://github.com/yourusername/flowtree' // Update with actual URL
    })
    .select();

  if (error) {
    console.error('Error uploading:', error);
  } else {
    console.log('✅ FlowTree uploaded successfully!', data);
    console.log('Refresh the Product Shelf to see it!');
  }
}

// Run it
uploadFlowTree();
