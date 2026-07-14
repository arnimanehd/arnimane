function parseDurationToSeconds(iso=""){const m=iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);if(!m)return 0;return Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0)}
async function yt(path,params){const url=new URL(`https://www.googleapis.com/youtube/v3/${path}`);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));const r=await fetch(url);if(!r.ok)throw new Error(`YouTube ${path} failed: ${r.status}`);return r.json()}
module.exports=async function handler(req,res){
  try{
    const apiKey=process.env.YOUTUBE_API_KEY,channelId=process.env.YOUTUBE_CHANNEL_ID;
    if(!apiKey||!channelId){res.statusCode=500;res.setHeader("Content-Type","application/json");res.end(JSON.stringify({error:"Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID."}));return}
    const channel=await yt("channels",{part:"contentDetails,statistics",id:channelId,key:apiKey});
    const item=channel.items?.[0];
    const uploadsPlaylist=item?.contentDetails?.relatedPlaylists?.uploads;
    if(!uploadsPlaylist)throw new Error("Could not find channel uploads playlist.");
    const playlist=await yt("playlistItems",{part:"snippet",maxResults:"40",playlistId:uploadsPlaylist,key:apiKey});
    const ids=playlist.items.map(i=>i.snippet?.resourceId?.videoId).filter(Boolean);
    const details=await yt("videos",{part:"snippet,contentDetails,statistics",id:ids.join(","),key:apiKey});
    const uploads=details.items.map(v=>{const durationSeconds=parseDurationToSeconds(v.contentDetails.duration);const thumb=v.snippet.thumbnails.maxres||v.snippet.thumbnails.high||v.snippet.thumbnails.medium||v.snippet.thumbnails.default;const isShort=durationSeconds<=60;return{id:v.id,title:v.snippet.title,publishedAt:v.snippet.publishedAt,thumbnail:thumb.url,durationSeconds,viewCount:Number(v.statistics?.viewCount||0),url:isShort?`https://www.youtube.com/shorts/${v.id}`:`https://www.youtube.com/watch?v=${v.id}`}});
    res.statusCode=200;
    res.setHeader("Content-Type","application/json");
    res.setHeader("Cache-Control","s-maxage=900, stale-while-revalidate=3600");
    res.end(JSON.stringify({
      stats:item.statistics||{},
      videos:uploads.filter(v=>v.durationSeconds>60).slice(0,12),
      shorts:uploads.filter(v=>v.durationSeconds<=60).slice(0,18)
    }));
  }catch(err){res.statusCode=500;res.setHeader("Content-Type","application/json");res.end(JSON.stringify({error:err.message}))}
};