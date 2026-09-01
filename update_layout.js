const fs = require('fs');

// 1. Dashboard Page
let dashboard = fs.readFileSync('src/app/(admin)/dashboard/page.tsx', 'utf8');
// Give activity rows a class so globals.css can target them
dashboard = dashboard.replace(/<div key=\{event.id\} style=\{\{ display: 'flex', alignItems: 'center'/g, 
  "<div key={event.id} className='activity-row' style={{ display: 'flex', alignItems: 'center'");
dashboard = dashboard.replace(/<div key=\{post.id\} style=\{\{ display: 'flex', alignItems: 'center'/g, 
  "<div key={post.id} className='activity-row' style={{ display: 'flex', alignItems: 'center'");
dashboard = dashboard.replace(/<div key=\{task.id\} style=\{\{ display: 'flex', alignItems: 'center'/g, 
  "<div key={task.id} className='activity-row' style={{ display: 'flex', alignItems: 'center'");
fs.writeFileSync('src/app/(admin)/dashboard/page.tsx', dashboard);

// 2. Globals CSS
let globals = fs.readFileSync('src/app/globals.css', 'utf8');
let appended = "\n@media (max-width: 900px) { .activity-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; } .activity-row > div:first-child { align-self: flex-start; } }";
fs.writeFileSync('src/app/globals.css', globals + appended);

// 3. LeadPipeline.module.css
let leads = fs.readFileSync('src/features/leads/components/LeadPipeline.module.css', 'utf8');
if(!leads.includes('@media')) {
  leads += "\n@media (max-width: 900px) { .board { grid-template-columns: 1fr; } }";
  fs.writeFileSync('src/features/leads/components/LeadPipeline.module.css', leads);
}

// 4. TaskList.module.css
let tasks = fs.readFileSync('src/features/tasks/components/TaskList.module.css', 'utf8');
if(!tasks.includes('@media')) {
  tasks += "\n@media (max-width: 900px) { .listWrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; } .taskItem { min-width: 800px; } }";
  fs.writeFileSync('src/features/tasks/components/TaskList.module.css', tasks);
}

console.log("Updates completed");
