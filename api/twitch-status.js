async function twitchToken(clientId,clientSecret){
  const url=new URL("https://id.twitch.tv/oauth2/token");
  url.searchParams.set("client_id",clientId);
  url.searchParams.set("client_secret",clientSecret);
  url.searchParams.set("grant_type","client_credentials");
  const r=await fetch(url,{method:"POST"});
  if(!r.ok)throw new Error("Could not get Twitch token.");
  return r.json();
}
module.exports=async function handler(req,res){
  try{
    const clientId=process.env.TWITCH_CLIENT_ID,clientSecret=process.env.TWITCH_CLIENT_SECRET,channel=process.env.TWITCH_CHANNEL||"Arnimane";
    if(!clientId||!clientSecret){
      res.statusCode=200;res.setHeader("Content-Type","application/json");
      res.end(JSON.stringify({live:null,title:"Streaming chaos live on Twitch! 🔥",followers:null,followersNote:"Twitch live status needs TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET."}));
      return;
    }
    const token=await twitchToken(clientId,clientSecret);
    const headers={"Client-ID":clientId,"Authorization":`Bearer ${token.access_token}`};

    const userUrl=new URL("https://api.twitch.tv/helix/users");
    userUrl.searchParams.set("login",channel);
    const userResp=await fetch(userUrl,{headers});
    const userData=await userResp.json();
    const user=userData.data?.[0];

    const streamsUrl=new URL("https://api.twitch.tv/helix/streams");
    streamsUrl.searchParams.set("user_login",channel);
    const streamResp=await fetch(streamsUrl,{headers});
    const streamData=await streamResp.json();
    const stream=streamData.data?.[0];

    res.statusCode=200;res.setHeader("Content-Type","application/json");res.setHeader("Cache-Control","s-maxage=180, stale-while-revalidate=300");
    res.end(JSON.stringify({
      live:!!stream,
      title:stream?.title||"Streaming chaos live on Twitch! 🔥",
      game:stream?.game_name||null,
      viewers:stream?.viewer_count||0,
      profileImage:user?.profile_image_url||null,
      broadcasterId:user?.id||null,
      followers:null,
      followersNote:"Twitch follower count requires user OAuth permissions; live viewers/game/title are auto-updating."
    }));
  }catch(err){
    res.statusCode=200;res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify({live:null,title:"Streaming chaos live on Twitch! 🔥",error:err.message}));
  }
};