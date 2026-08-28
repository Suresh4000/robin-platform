const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Remove script tags
code = code.replace(/<script[\s\S]*?<\/script>/g, '');
code = code.replace(/<script[\s\S].*\/>/g, '');

// 2. Fix Blog section implementation
const blogRegex = /<section className="section section-alt" id="blog-list">[\s\S]*?<\/section>/;
const dynamicBlog = `
<section className="section section-alt" id="blog-list">
  <div className="container">
    <div className="grid grid-3">
      {initialPosts && initialPosts.length > 0 ? (
        initialPosts.map((post) => (
          <div className="article-card reveal in" key={post.id}>
            {post.coverImage && <div className="thumb"><img alt={post.title} src={post.coverImage} /></div>}
            <div className="abody">
              <span className="tag">{post.category}</span>
              <h4>{post.title}</h4>
              <p>{post.excerpt}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  </div>
</section>
`;
code = code.replace(blogRegex, dynamicBlog);

// 3. Fix the contact form
// Look for where `<div className="form-grid">` starts since my prior replacement failed to add </form> cleanly if string match failed.
if (code.includes('onSubmit={handleContactSubmit}')) {
    console.log('Form grid is there');
}

// Check if there are any <hr> or <br> not closed (like <br> without />). Handled by create-jsx.js already.

fs.writeFileSync('src/app/page.tsx', code);
