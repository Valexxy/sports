(function() {
  // Find all mivaj embed containers
  const embeds = document.querySelectorAll('.mivaj-embed');
  
  embeds.forEach(container => {
    const match = container.getAttribute('data-match') || 'featured';
    
    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://mivaj.com/embed/match-intel?match=${match}`;
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    iframe.style.overflow = 'hidden';
    
    // Create the SEO backlink (Crucial for 2026 virality)
    const backlink = document.createElement('div');
    backlink.style.textAlign = 'center';
    backlink.style.marginTop = '8px';
    backlink.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    backlink.style.fontSize = '12px';
    
    const link = document.createElement('a');
    link.href = 'https://mivaj.com';
    link.target = '_blank';
    link.rel = 'noopener'; // NOT nofollow, we want the link juice if they allow it, but we use safe anchor text
    link.textContent = '? Powered by Mivaj AI - Get VIP SportyBet Codes';
    link.style.color = '#10b981';
    link.style.textDecoration = 'none';
    link.style.fontWeight = 'bold';
    
    link.onmouseover = () => link.style.textDecoration = 'underline';
    link.onmouseout = () => link.style.textDecoration = 'none';
    
    backlink.appendChild(link);
    
    // Append to container
    container.innerHTML = '';
    container.appendChild(iframe);
    container.appendChild(backlink);
  });
})();
