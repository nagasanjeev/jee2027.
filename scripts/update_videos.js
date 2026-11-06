// Runs in GitHub Actions. Uses the official YouTube Data API v3 (no scraping). Key comes from the YT_API_KEY secret.
const fs=require("fs");
const KEY=process.env.YT_API_KEY;
if(!KEY){console.error("YT_API_KEY secret missing");process.exit(1)}
const cfg=JSON.parse(fs.readFileSync("queries.json","utf8"));
const out=JSON.parse(fs.readFileSync("videos.json","utf8"));
const after=new Date(Date.now()-cfg.daysBack*864e5).toISOString();
async function search(q,channelId){
 const u=new URL("https://www.googleapis.com/youtube/v3/search");
 Object.entries({part:"snippet",type:"video",order:"date",maxResults:10,q,publishedAfter:after,relevanceLanguage:"en",safeSearch:"strict",key:KEY}).forEach(([k,v])=>u.searchParams.set(k,v));
 if(channelId)u.searchParams.set("channelId",channelId);
 const r=await fetch(u);const j=await r.json();
 if(!r.ok){console.error("API error",r.status,j.error&&j.error.message);return null}
 return (j.items||[]).map(i=>({id:i.id.videoId,title:i.snippet.title,channel:i.snippet.channelTitle,published:i.snippet.publishedAt}));
}
(async()=>{
 let failed=false;
 for(const [sub,c] of Object.entries(cfg.subjects)){
  const seen=new Map((out.videos[sub]||[]).map(v=>[v.id,v]));
  const jobs=c.channelIds.length?c.channelIds.flatMap(ch=>c.queries.map(q=>[q,ch])):c.queries.map(q=>[q,null]);
  for(const [q,ch] of jobs){const r=await search(q,ch);if(!r){failed=true;continue}r.forEach(v=>{if(v.id&&v.title&&!seen.has(v.id))seen.set(v.id,v)})}
  out.videos[sub]=[...seen.values()].sort((a,b)=>b.published.localeCompare(a.published)).slice(0,cfg.maxPerSubject);
 }
 out.updated=new Date().toISOString().slice(0,10);
 fs.writeFileSync("videos.json",JSON.stringify(out,null,1));
 if(failed)console.error("Some requests failed (quota/key restrictions?). Kept previous data for those.");
})();
