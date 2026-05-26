// Cloudflare Worker for Iraq Businesses Dashboard
// Converted from Express to Workers API

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Load businesses data from KV
    let businessesData = [];
    try {
      const data = await env.BUSINESS_DATA.get('businesses');
      if (data) {
        businessesData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }

    // API Routes
    if (path === '/api/businesses') {
      const governorate = url.searchParams.get('governorate');
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');

      let filtered = [...businessesData];

      if (governorate && governorate !== 'all') {
        filtered = filtered.filter(b => 
          b.governorate && b.governorate.toLowerCase() === governorate.toLowerCase()
        );
      }

      if (category && category !== 'all') {
        filtered = filtered.filter(b => 
          b.category && b.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(b => 
          (b.name && b.name.toLowerCase().includes(searchLower)) ||
          (b.address && b.address.toLowerCase().includes(searchLower)) ||
          (b.bio && b.bio.toLowerCase().includes(searchLower))
        );
      }

      return new Response(JSON.stringify({
        success: true,
        count: filtered.length,
        data: filtered
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/governorates') {
      const governorates = [...new Set(businessesData.map(b => b.governorate).filter(Boolean))];
      governorates.sort();
      
      return new Response(JSON.stringify({
        success: true,
        data: governorates
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/categories') {
      const categories = [...new Set(businessesData.map(b => b.category).filter(Boolean))];
      categories.sort();
      
      return new Response(JSON.stringify({
        success: true,
        data: categories
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/businesses/')) {
      const id = path.split('/').pop();
      const business = businessesData.find(b => b.id === id);
      
      if (!business) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Business not found'
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: business
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({
        success: true,
        message: 'API is running',
        dataCount: businessesData.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({
      success: false,
      message: 'Not found'
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
