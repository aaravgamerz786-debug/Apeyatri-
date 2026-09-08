export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const key=process.env.NVIDIA_API_KEY;
  if(!key)return res.status(500).json({error:'API key not configured'});
  try{
    const{messages}=req.body;
    const r=await fetch('https://integrate.api.nvidia.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:'nvidia/ising-calibration-1.5-31b',messages,temperature:0.7,max_tokens:300,stream:false})
    });
    if(!r.ok)return res.status(r.status).json({error:await r.text()});
    return res.status(200).json(await r.json());
  }catch(e){return res.status(500).json({error:e.message});}
}
